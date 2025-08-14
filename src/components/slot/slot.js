export default class Slot extends Phaser.GameObjects.Container {
    /**
     * 
     * @param {any} scene 
     * @param {any} op options
     * @param {{globalOptions}} deps 
     */
    constructor(deps, op) {
        const { globalOptions, SpriteAdapter } = deps
        super(op.scene, op.x, op.y);
        this._globalOptions = globalOptions;
        this._isFall = false;
        this.options = Object.assign({},
            {
                scene: null,
                imgName: '',
                symbolX: this._globalOptions.reelsWidth / 2,
                symbolY: 0,
                x: 0,
                y: 0,
                gravity: 0,
                height: 0,
                onFall: () => { },
                onCollide: () => { },
            },
            op);
        // create container
        op.scene.add.existing(this);
        this.width = this._globalOptions.reelsWidth;
        this.height = this.options.height;
        this.setSize(this.width, this.height);
        // create _floor
        this._floor = this.options.scene.physics.add.staticSprite(this.options.x + this.width / 2, this.options.y + this.height, null);
        this._floor.setSize(this.width, 1);
        this._floor.visible = false;
        this._symbolSkins = ["Assassin", "Beardy", "Pamela-1", "Pamela-2", "Pamela-5", "Buck", "Chuck", "Stumpy", "Truck", "Young"];
        // add symbol
        this.addSymbol(this.options.imgName, this._randomBetween(0, 9));

        // const table = this.options.scene.add.graphics();
        // table.lineStyle(2, 0xffd700, 1);
        // table.strokeRect(3, 3, this.width - 6, this.height - 6);
        // this.add(table);
        // table.setDepth(5);
    }
    addSymbol(existingImgName, randomNumber) {
        this.imgName = existingImgName || (this._symbolSkins[randomNumber]);
        const symbol = this.options.scene.add.spine(this.options.symbolX, this.options.symbolY, "hero", "hero-atlas");
        symbol.animationState.setAnimation(0, "idle", true);
        symbol.skeleton.setSkinByName(this.imgName);
        this.options.scene.physics.add.existing(symbol);
        symbol.name = this.imgName;
        this.add(symbol);
        symbol.body.setCollideWorldBounds(false);
        symbol.body.setGravityY(this._globalOptions.symbolCollisionGravity);
        symbol.body.setBounce(this._globalOptions.symbolBounce);
        symbol.setScale(this._globalOptions.symbolScale);
        symbol.width = this._globalOptions.symbolOriginalWidth * this._globalOptions.symbolScale;
        symbol.height = this._globalOptions.symbolOriginalHeight * this._globalOptions.symbolScale;
        this.symbol = symbol;
        /**detect collistion*/
        this.options.scene.physics.add.collider(symbol.body, this._floor, (symbol) => {
            if (!symbol.isCollided) {
                this._vibrateAnim();
            }
            symbol.isCollided = true;
        });
    }
    _randomBetween(min, max) {
        return Phaser.Math.Between(min, max);
    }
    _vibrateAnim() {
        if (!this._hasBounce) {
            // create custom bounce effect for symbol
            const initialY = this.symbol.y;

            // Create a tween that makes the sprite vibrate
            const vibrateTween = this.options.scene.tweens.add({
                targets: this.symbol,
                y: initialY - 10,  // Move up by 5 pixels
                duration: 30,     // A very short duration for a fast movement
                ease: 'Linear',   // A linear ease for a consistent vibration
                yoyo: true,       // Move back down
                repeat: -1        // Repeat indefinitely
            });

            // Create a timer event to stop the vibration after 1000ms (1 second)
            this.options.scene.time.delayedCall(70, () => {
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
        if (this._isFall == true) {
            ///// remove symbol which is out of container
            const symbol = this.symbol;
            const childMatrix = symbol.getWorldTransformMatrix();
            const worldY = childMatrix.ty;
            if ((worldY > 0) && worldY > (this._globalOptions.machineY + this._globalOptions.machineHeight + this._globalOptions.symbolOriginalHeight)) {
                this._isFall = false;
                this.remove(symbol, true);
                this.options.onFall(this);
            }
        }
    }
    fall() {
        this._isFall = true;
        this.symbol.body.setGravityY(this._globalOptions.symbolFallGravity);
    }
    destroy() {
        super.destroy();
    }
}