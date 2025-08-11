function Hero(deps, scene) {
    this._scene = scene;
    const { pub_sub } = deps();
    this._hero = scene.add.spine(120, 580, "hero", "hero-atlas");
    this._hero.animationStateData.setMix('idle', 'morningstar pose', 0.2);
    this._hero.animationStateData.setMix('morningstar pose', 'idle', 0.2);
    this._hero.animationState.setAnimation(0, "idle", true);
    this._hero.setDepth(0);
    pub_sub.on('onPlus', () => { this.animate("morningstar pose"); })
}
Hero.prototype = {
    animate: function (anim) {
        this._hero.animationState.setAnimation(0, anim, true);
        setTimeout(() => { this._hero.animationState.setAnimation(0, "idle", true); }, 800);
    }
};
export default Hero;