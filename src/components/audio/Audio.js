//Class Audio
export default class Audio {
    constructor(deps, scene) {
        this.scene = scene;
        this.scene.sound.stopAll();
        const { pub_sub, Config, Sprite, Options } = deps();
        this._options = Options;
        this._muteMusic = false;
        this.loadAudio();
        this.btnMusic = new Sprite(scene, Config.width - 310, Config.height - 675, 'sound', "btn_sound.png");
        this.btnMusic.setScale(0.6);
        //this.audioMusicName = this.btnMusic.frame.name;
        //play audio default
        this.btnMusic.on('pointerdown', this.onMusic, this);
        pub_sub.on('onClick', () => { this._muteMusic || this.audioButton.play(); });
        pub_sub.on('onSpin', () => { setTimeout(() => { this._muteMusic || this.audioReels.play(); }, 200) });
        pub_sub.on('onCollide', () => { this.audioReels.stop(); });
        pub_sub.on('onPlus', () => { this._muteMusic || this.audioWin.play(); });
    }

    loadAudio() {
        this.musicBackgroundDefault = this.scene.sound.add('backgroundDefault', {
            loop: true,
            volume: 1.5
        });
        this.audioReels = this.scene.sound.add('reels');
        this.audioReelStop = this.scene.sound.add('reelStop');
        this.audioWin = this.scene.sound.add('win', { loop: false });
        this.audioButton = this.scene.sound.add('button');
        this.audioLose = this.scene.sound.add('lose', { volume: 2.5 });
        this.musicDefault = this.scene.sound.add('musicDefault', {
            loop: true,
            volume: 2
        });
    }
    onMusic() {
        this._muteMusic = !this._muteMusic;
        if (this._muteMusic) {
            this.scene.sound.stopAll();
            this.btnMusic.setTexture('sound', "btn_sound_off.png");
        } else {
            this.btnMusic.setTexture('sound', "btn_sound.png");
            this.musicDefaultIns = this.musicDefault.play();
        }
    }
}