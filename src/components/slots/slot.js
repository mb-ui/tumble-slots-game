export default class Slot extends Phaser.GameObjects.Container {
    /**
     * 
     * @param {any} scene 
     * @param {any} op options
     * @param {{globalOptions}} deps 
     */
    constructor(deps, scene, op) {
        const { globalOptions } = deps
        const x = op.x;
        const y = op.y;
        super(scene, x, y);
        this._scene = scene;
        this.positionY = y;
        this.positionX = x;
        this._globalOptions = globalOptions;
        this._isFall = false;
        this.symbolHeight = this._globalOptions.symbolHeight;
        this.options = Object.assign({},
            {
                onFall: () => { },
                order: 0,
                columnIndex: 0,
                imgName: '',
                symbolX: this._globalOptions.slotWidth / 2,
                symbolY: 0,
                x: 0,
                y: 0,
                enableFallDetection: false,
                onCollide: () => { },
            },
            op);
        // add container
        scene.add.existing(this);
        this._flag = false;
        this.width = this._globalOptions.slotWidth;
        this.height = this._globalOptions.slotHeight;
        this.setSize(this.width, this.height);
        // adding floor
        this.floor = this._scene.physics.add.staticSprite(this.positionX, this.positionY + this._globalOptions.slotHeight, null);
        this.floor.setSize(this._globalOptions.slotWidth, 1);
        this.floor.visible = false;
        // add symbol
        this._setEnableFallDetection(true).addSymbol(this.options.imgName);
    }
    _setEnableFallDetection(value) {
        this.enableCollide = value;
        return this;
    }
    addSymbol(existingImgName) {
        this.imgName = existingImgName || ('symbols_' + this._randomBetween(0, 9));
        const symbol = this._scene.physics.add.sprite(this.options.symbolX, this.options.symbolY, 'symbols', this.imgName + '.png');
        symbol.name = this.imgName;
        this.add(symbol);
        symbol.setCollideWorldBounds(false);
        symbol.body.setGravityY(this._globalOptions.symbolCollisionGravity);
        symbol.body.setBounce(this._globalOptions.symbolBounce);
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
                setTimeout(() => {
                    this.options.onCollide(this);
                }, 200);
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
            if ((worldY > 0) && worldY > (this._globalOptions.slotsY + this._globalOptions.slotHeight + this._globalOptions.symbolHeight)) {
                this.remove(symbol, true);
                this.options.onFall(this);
            }
        }
    }
    empty() {
        this.symbol.body.setGravityY(this._globalOptions.symbolFallGravity);
        this._setEnableFallDetection(false);
    }
    destroy() {
        const { columnIndex, order } = this.options;
        super.destroy();
        this._scene.slots.list[columnIndex][order] = null
    }
}