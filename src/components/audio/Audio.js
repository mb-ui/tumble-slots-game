//Class Audio
export default class Audio {
    constructor(deps, { scene }) {
        this._scene = scene;
        const { Config, Sprite, Options } = deps();
        this._config = Config;
        this._Sprite = Sprite;
        this._options = Options;
        this._loadAudio();
    }
    _loadAudio() {
        this.musicBackgroundDefault = this._scene.sound.add('backgroundDefault', {
            loop: true,
            volume: 1.5
        });
        this.audioCollide0 = this._scene.sound.add('bubble2', { loop: false });
        this.audioCollide2 = this._scene.sound.add('bubble2', { loop: false });
        this.audioCollide1 = this._scene.sound.add('bubble2', { loop: false });
        this.audioFall0 = this._scene.sound.add('fall0', { loop: false });
        this.audioFall2 = this._scene.sound.add('fall0', { loop: false });
        this.audioFall1 = this._scene.sound.add('fall0', { loop: false });
        this.audioExplode = this._scene.sound.add('explode0', { loop: false });
        this.audioWin = this._scene.sound.add('win', { loop: false });
        this.audioButton = this._scene.sound.add('button');
    }
}