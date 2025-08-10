import Options from '../options';
export default class Container extends Phaser.GameObjects.Container {
    constructor(scene, op) {
        const x = op.x;
        const y = op.y;
        super(scene, x, y);
        this._scene = scene;
        this.positionY = y;
        this.positionX = x;
        this.symbolHeight = Options.symbolHeight;
        this.height = Options.slotHeight;
        this.width = Options.slotWidth;
        this._isFall = false;
        this.options = Object.assign({},
            {
                onEmpty: () => { },
                order: 0,
                columnIndex: 0,
                imgName: '',
                symbolX: Options.slotWidth / 2,
                //symbolY: 0,
                enableFallDetection: false,
                onFall: () => { },
            },
            op);
        // add container
        scene.add.existing(this);
        this._flag = false;
        this.setSize(this.width, this.height);
        // adding floor
        this.floor = this._scene.physics.add.staticSprite(this.positionX, this.positionY + this.height, null);
        this.floor.setSize(this.width, 1);
        this.floor.visible = false;
        // add symbol
        this._setEnableFallDetection(true).addSymbol(this.options.imgName);
    }
    _setEnableFallDetection(value) {
        this.enableCollide = value;
        return this;
    }
    addSymbol(existingImgName) {
        // const backgroundGraphics = this._scene.add.graphics();
        // backgroundGraphics.fillStyle(0x0000ff, 1); // Blue with full opacity
        // backgroundGraphics.fillRect(0, 0, this.width, this.height);
        // this.add(backgroundGraphics);

        this.imgName = existingImgName || ('symbols_' + this._randomBetween(0, 9));
        const symbol = this._scene.physics.add.sprite(this.options.symbolX, this.options.symbolY, 'symbols', this.imgName + '.png');
        symbol.name = this.imgName;
        this.add(symbol);
        symbol.setCollideWorldBounds(false);
        symbol.body.setGravityY(Options.symbolCollisionGravity);
        symbol.body.setBounce(Options.symbolBounce);
        ////////
        this._scene.physics.add.collider(symbol, this.floor, (symbol) => {
            if (!symbol.isCollid) {
                this._onCollide();
            }
            symbol.isCollid = true;
        }, () => this.enableCollide);
        this.symbol = symbol;
    }
    _randomBetween(min, max) {
        return Phaser.Math.Between(min, max);
    }
    _onCollide() {
        if (!this._hasBounce) {
            // create custom bounce effect for symbol
            const initialY = this.symbol.y;

            // Create a tween that makes the sprite vibrate
            const vibrateTween = this._scene.tweens.add({
                targets: this.symbol,
                y: initialY - 10,  // Move up by 5 pixels
                duration: 30,     // A very short duration for a fast movement
                ease: 'Linear',   // A linear ease for a consistent vibration
                yoyo: true,       // Move back down
                repeat: -1        // Repeat indefinitely
            });

            // Create a timer event to stop the vibration after 1000ms (1 second)
            this._scene.time.delayedCall(70, () => {
                vibrateTween.stop();
                // Reset the sprite's position to its original y value to ensure it's not
                // left at an offset after the tween is stopped.
                this.symbol.y = initialY;
                this.options.onFall();
            }, [], this);
        }
        this._hasBounce = true;
    }
    update() {
        if (this.enableCollide == false) {
            ///// remove symbol which is out of container
            const symbol = this.symbol;
            const childMatrix = symbol.getWorldTransformMatrix();
            const worldY = childMatrix.ty;
            if ((worldY > 0) && worldY > (Options.slotsY + Options.slotHeight + Options.symbolHeight)) {
                this.remove(symbol, true);
                this.options.onEmpty(this.options.columnIndex, this.options.order);
            }
        } else if (this.options.enableFallDetection && this.symbol && !this._isFall) {
            ///////// detect when the symbol has finished its fall ///////////
            // const symbol = this.symbol;
            // const childMatrix = symbol.getWorldTransformMatrix();
            // const worldY = childMatrix.ty;
            // if (
            //     worldY >= this.positionY + this.height - ((this.options.order + 1) * Options.symbolHeight) &&
            //     (this.symbol._lastWorldY == worldY)
            // ) {
            //     this._isFall = true;
            //     //this._onCollide();
            // } else {
            //     this.symbol._lastWorldY = worldY;
            // }
        }
    }
    empty() {
        this.symbol.body.setGravityY(Options.symbolFallGravity);
        this._setEnableFallDetection(false);
    }
    destroy() {
        const { columnIndex, order } = this.options;
        super.destroy();
        this._scene.containers.list[columnIndex][order] = null
    }
}