
function Explode(scene) {
    this._scene = scene;
}
Explode.prototype = {
    /**
     * @param {number} x  
     * @param {number} y
     * @param {()=>void} animationSart
     * @param {()=>void} animationEnd
     * */
    anim: function (x, y, animationSart, animationEnd) {
        this.explode = this._scene.physics.add.staticSprite(x, y, 'explode');
        this.explode.setDepth(2);
        if (!this._scene.anims.exists('explode')) {
            this._scene.anims.create({
                key: 'explode',
                frameRate: 10,
                frames: this._scene.anims.generateFrameNumbers('explode')
            });
        }
        animationSart();
        this.explode.anims.play('explode', false);
        this._scene.tweens.add({
            targets: this.explode,
            alpha: 0,
            duration: 300, // Duration in milliseconds
            ease: 'Linear', // Optional easing function
            onComplete: () => {
                this.explode.destroy();
                animationEnd();
            }
        });
    }
};
export default Explode;