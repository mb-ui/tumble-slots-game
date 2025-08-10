function explode(scene, obj, options) {
    if (scene && obj) {
        return new Explode(scene, obj, options);
    }
}
function Explode(scene, obj, options = {}) {
    this._obj = obj;
    this._scene = scene;
    this._options = Object.assign({}, { onDestroy: () => { } }, options)
    this._obj.first.alpha = 0.3;
    setTimeout(() => {
        const x = obj.positionX;
        const y = obj.positionY + obj.height - (obj.options.order * obj.symbolHeight) - (obj.symbolHeight / 2);
        this.explode = this._scene.physics.add.staticSprite(x, y, 'explode');
        this.explode.setDepth(2);
        if (!this._scene.anims.exists('explode')) {
            this._scene.anims.create({
                key: 'explode',
                frameRate: 10,
                frames: this._scene.anims.generateFrameNumbers('explode')
            });
        }
        this._obj.destroy();
        this.explode.anims.play('explode', false);
        this._scene.tweens.add({
            targets: this.explode,
            alpha: 0,
            duration: 300, // Duration in milliseconds
            ease: 'Linear', // Optional easing function
            onComplete: () => {
                this.explode.destroy();
                this._options.onDestroy();
            }
        });
    }, 500);
}
Explode.prototype = {};
export default explode;