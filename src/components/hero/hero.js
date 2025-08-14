function Hero(deps, scene) {
    this._scene = scene;
    this.defaultAnim = 'idle';
    const { pub_sub } = deps();
    this._hero = scene.add.spine(140, 580, "hero", "hero-atlas");
    // this._hero.animationStateData.setMix(this.defaultAnim, 'morningstar pose', 0.2);
    // this._hero.animationStateData.setMix('morningstar pose', this.defaultAnim, 0.2);
    // this._hero.animationStateData.setMix(this.defaultAnim, 'head-turn', 0.3);
    // this._hero.animationStateData.setMix('head-turn', this.defaultAnim, 0.5);
    this._hero.animationState.setAnimation(0, this.defaultAnim, false);
    this._hero.setScale(0.2);
    this._hero.skeleton.setSkinByName('Gabriel');
    // pub_sub.on('onPlus', () => { setTimeout(() => this.animate("morningstar pose", true, 800), 500) });
    // pub_sub.on('onExplod', () => { this.animate("head-turn", true, 500); });
}
Hero.prototype = {
    animate: function (anim, loop, duration) {
        // this._hero.animationState.setAnimation(0, anim, loop);
        // setTimeout(() => { this._hero.animationState.setAnimation(0, this.defaultAnim, true); }, duration);
    }
};
export default Hero;