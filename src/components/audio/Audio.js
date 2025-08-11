//Class Audio
export default class Audio {
    constructor(deps, scene) {
        this.scene = scene;
        this.scene.sound.stopAll();
        const { pub_sub, Config, Sprite, Options } = deps();
        this._pub_sub = pub_sub;
        this._config = Config;
        this._Sprite = Sprite;
        this._options = Options;
        this._muteMusic = false;
        this._slotsState = 'ready';
        this.loadAudio();

    }
    createButton() {
        this.btnMusic = new this._Sprite(this.scene, this._config.width - 310, this._config.height - 675, 'sound', "btn_sound.png");
        this.btnMusic.setScale(0.6);
        this.btnMusic.on('pointerdown', () => { this._muteMusic = !this._muteMusic; this.onMusic(); });
        this._pub_sub.on('onClick', () => { this._muteMusic || this.audioButton.play(); });
        this._pub_sub.on('onWin', () => { this._slotsState = 'win' });
        this._pub_sub.on('onFail', () => { this._slotsState = 'fail' });
        this._pub_sub.on('onSpin', () => { });
        this._pub_sub.on('onCollide', ({ collision, slots, isLastCollide }) => {
            if (this._muteMusic == false && collision.order == 0 && this._slotsState != 'win') {
                this[`audioCollide${collision.columnIndex}`] && this[`audioCollide${collision.columnIndex}`].play();
            }
        });
        this._pub_sub.on('onFall', (collision) => {
            if (this._muteMusic == false && collision.order == 0) {
                this[`audioFall${collision.columnIndex}`].play();
            }
        });
        this._pub_sub.on('onPlus', () => { this._muteMusic || this.audioWin.play(); });
        this._pub_sub.on('onExplod', () => {
            this._muteMusic || this.explode0.play();

        });
    }
    loadAudio() {
        this.musicBackgroundDefault = this.scene.sound.add('backgroundDefault', {
            loop: true,
            volume: 1.5
        });
        this.audioCollide0 = this.scene.sound.add('bubble2', { loop: false });
        this.audioCollide2 = this.scene.sound.add('bubble2', { loop: false });
        this.audioCollide3 = this.scene.sound.add('bubble2', { loop: false });
        this.audioCollide4 = this.scene.sound.add('bubble2', { loop: false });
        this.audioCollide1 = this.scene.sound.add('bubble2', { loop: false });
        this.audioFall0 = this.scene.sound.add('fall0', { loop: false });
        this.audioFall2 = this.scene.sound.add('fall0', { loop: false });
        this.audioFall3 = this.scene.sound.add('fall0', { loop: false });
        this.audioFall4 = this.scene.sound.add('fall0', { loop: false });
        this.audioFall1 = this.scene.sound.add('fall0', { loop: false });
        this.explode0 = this.scene.sound.add('explode0', { loop: false });
        this.audioWin = this.scene.sound.add('win', { loop: false });
        this.audioButton = this.scene.sound.add('button');
    }
    onMusic() {
        if (this._muteMusic) {
            this.scene.sound.stopAll();
            this.btnMusic.setTexture('sound', "btn_sound_off.png");
        } else {
            this.btnMusic.setTexture('sound', "btn_sound.png");
        }
    }
}