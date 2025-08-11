
function Explode(scene) {
    this._scene = scene;
}
Explode.prototype = {
    /**
     * @param {any} slot  
     * @param {()=>void} onDestroy
     * */
    explod: function (slot, onDestroy) {
        slot.symbol.alpha = 0.3;
        setTimeout(() => {
            const x = slot.positionX + slot.options.symbolX;
            const y = slot.positionY + slot.height - (slot.symbolHeight / 2);
            this.explode = this._scene.physics.add.staticSprite(x, y, 'explode');
            this.explode.setDepth(2);
            if (!this._scene.anims.exists('explode')) {
                this._scene.anims.create({
                    key: 'explode',
                    frameRate: 10,
                    frames: this._scene.anims.generateFrameNumbers('explode')
                });
            }
            slot.destroy();
            this.explode.anims.play('explode', false);
            this._scene.tweens.add({
                targets: this.explode,
                alpha: 0,
                duration: 300, // Duration in milliseconds
                ease: 'Linear', // Optional easing function
                onComplete: () => {
                    this.explode.destroy();
                    onDestroy();
                }
            });
        }, 500);
    }
};
export default Explode;