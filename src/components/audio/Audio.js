//Class Audio
export default class Audio {
    constructor(deps, scene) {
        this.scene = scene;
        this.scene.sound.stopAll();
        const { pub_sub, Config, Sprite, Options } = deps();
        this._options = Options;
        let _muteMusic = false;
        this._slotsState = 'ready';
        this.loadAudio();
        this.btnMusic = new Sprite(scene, Config.width - 310, Config.height - 675, 'sound', "btn_sound.png");
        this.btnMusic.setScale(0.6);
        this.btnMusic.on('pointerdown', () => { _muteMusic = !_muteMusic; this.onMusic(_muteMusic); });
        pub_sub.on('onClick', () => { _muteMusic || this.audioButton.play(); });
        pub_sub.on('onWin', () => { this._slotsState = 'win' });
        pub_sub.on('onFail', () => { this._slotsState = 'fail' });
        pub_sub.on('onSpin', () => { });
        pub_sub.on('onCollide', ({ collision, slots, isLastCollide }) => {
            if (_muteMusic == false && collision.order == 0 && this._slotsState != 'win') {
                this[`audioCollide${collision.columnIndex}`] && this[`audioCollide${collision.columnIndex}`].play();
            }
        });
        pub_sub.on('onFall', (collision) => {
            if (_muteMusic == false && collision.order == 0) {
                this[`audioFall${collision.columnIndex}`].play();
            }
        });
        pub_sub.on('onPlus', () => { _muteMusic || this.audioWin.play(); });
        pub_sub.on('onExplod', () => {
            _muteMusic || this.explode0.play();

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
    onMusic(_muteMusic) {
        if (_muteMusic) {
            //this.scene.sound.stopAll();
            this.btnMusic.setTexture('sound', "btn_sound_off.png");
        } else {
            this.btnMusic.setTexture('sound', "btn_sound.png");
        }
    }
}