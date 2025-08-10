import Options from '../options';
export default class Container extends Phaser.GameObjects.Container {
    constructor(scene, x, y, op = {}) {
        super(scene, x, y);
        this._scene = scene;
        this.positionY = y;
        this.positionX = x;
        this.symbolHeight = Options.symbolHeight;
        this.height = Options.slotHeight;
        this.width = Options.slotWidth;
        this._fall = true;
        this.options = Object.assign({},
            {
                onEmpty: () => { },
                order: 0,
                columnIndex: 0,
                offsetY: 0,
                imgName: '',
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
        this.symbol = this._setEnableFallDetection(true).addSymbol(this.options.imgName);
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
        const symbol = this._scene.physics.add.sprite(this.width / 2, (-10 * (this.options.order + 1)), 'symbols', this.imgName + '.png');
        symbol.name = this.imgName;
        this.add(symbol);
        symbol.setCollideWorldBounds(false);
        symbol.body.setGravityY(Options.symbolGravityY);
        symbol.body.setBounce(Options.symbolBounce);
        ////////
        this._scene.physics.add.collider(symbol, this.floor, (symbol) => {
            if (!symbol.isCollid) {
                this._onCollide();
            }
            symbol.isCollid = true;
        }, () => this.enableCollide);
        return symbol;
    }
    _randomBetween(min, max) {
        return Phaser.Math.Between(min, max);
    }
    _onCollide() {
        if (!this._flag) {
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
            }, [], this);
        }
        this._flag = true;
        this.options.onFall();
    }
    update() {
        if (this.body && this.list.length) {
            if (this.body.collideWorldBounds == false) {
                ///// remove symbol which is out of container
                const symbol = this.first;
                const childMatrix = symbol.getWorldTransformMatrix();
                const worldY = childMatrix.ty;
                if (worldY > (this.positionY + this.height + Options.symbolHeight)) {
                    this.remove(symbol, true);
                    this.options.onEmpty(this.options.columnIndex, this.options.order);
                }
            } else if (this.options.enableFallDetection && this.first && this._fall) {
                ///////// detect when the symbol has finished its fall ///////////
                const symbol = this.first;
                const childMatrix = symbol.getWorldTransformMatrix();
                const worldY = childMatrix.ty;
                if (
                    worldY >= this.positionY + this.height - ((this.options.order + 1) * Options.symbolHeight) &&
                    (this.first._lastWorldY == worldY)
                ) {
                    this._fall = false;
                    this._onCollide();
                } else {
                    this.first._lastWorldY = worldY;
                }
            }
        }
    }
    empty() {
        //this.first.animationState.setAnimation(0, "fall", true);
        this._setEnableFallDetection(false);
    }
    destroy() {
        const { columnIndex, order } = this.options;
        super.destroy();
        this._scene.containers.list[columnIndex][order] = null
    }
}