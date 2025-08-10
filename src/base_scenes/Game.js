import Config from '../config';
import Options from '../options';
//import Class
import Audio from '../base_classes/Audio';
import Sprite from '../base_classes/Sprite';
import Slots from '../base_classes/slots/slots.factory';
import Info from '../base_classes/Info';
import Maxbet from '../base_classes/Maxbet';
import BaseSpin from '../base_classes/BaseSpin';
import Score from '../base_classes/score';
export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    create() {
        //Class Audio
        this.audioObject = new Audio(this);
        // bitmap text
        Options.hsv = Phaser.Display.Color.HSVColorWheel();
        //add bg image
        const bg = new Sprite(this, Config.width / 2, Config.height / 2, 'background', 'bg.jpg');
        bg.setDepth(-1);
        //container
        this.containers = new Slots(this);
        //add image machine
        const machine = new Sprite(this, Config.width / 2, Config.height / 2, 'background', 'machine.png');
        machine.setDepth(0);
        // add Hero
        this.hero = this.add.spine(120, 580, "hero", "hero-atlas");
        this.hero.animationState.setAnimation(0, "idle", true);
        this.hero.setDepth(0);
        // Evalute
        this.score = new Score(this);
        //
        this.valueMoney = Options.money;
        this.txtMoney = this.add.text(Config.width - 1050, Config.height - 695, this.valueMoney + '$', {
            fontSize: '30px',
            color: '#fff',
            fontFamily: 'PT Serif'
        });
        this.setTextX(this.valueMoney);
        //Add sound image
        const musicName = localStorage.getItem('music') ? localStorage.getItem('music')
            : 'btn_music_off.png';
        const soundName = localStorage.getItem('sound') ? localStorage.getItem('sound')
            : 'btn_sound_off.png';
        this.btnMusic = new Sprite(this, Config.width - 310, Config.height - 675, 'sound', musicName).setScale(0.6);
        this.btnSound = new Sprite(this, Config.width - 390, Config.height - 675, 'sound', soundName).setScale(0.6);
        this.audioMusicName = this.btnMusic.frame.name;
        this.audioSoundName = this.btnSound.frame.name;
        this.btnMusic.on('pointerdown', this.onMusic, this);
        this.btnSound.on('pointerdown', this.onSound, this);
        //play audio default
        if (this.audioMusicName === 'btn_music.png') {
            this.audioObject.musicDefault.play();
        }
        //Class Maxbet
        this.maxBet = new Maxbet(this);
        //Class Info
        this.info = new Info(this);
        //Class BaseSpin
        this.baseSpin = new BaseSpin(this);
    }
    update() {
        this.containers.update();
    }
    onMusic() {
        if (!Options.checkClick) {
            if (this.audioMusicName === 'btn_music.png') {
                this.audioMusicName = 'btn_music_off.png';
                //audio stop
                this.audioObject.musicDefault.stop();
                this.audioObject.audioWin.stop();
            } else {
                this.audioMusicName = 'btn_music.png';
                this.audioPlayButton();
                //audio play
                this.audioObject.musicDefault.play();
            }
            //save localstorage
            if (localStorage.getItem('musics')) {
                localStorage.removeItem('musics');
                localStorage.setItem('music', this.audioMusicName);
            } else {
                localStorage.setItem('music', this.audioMusicName);
            }
            this.btnMusic.setTexture('sound', this.audioMusicName);
        }
    }

    onSound() {
        if (!Options.checkClick) {
            if (this.audioSoundName === 'btn_sound.png') {
                this.audioSoundName = 'btn_sound_off.png';
            } else {
                this.audioSoundName = 'btn_sound.png';
                this.audioObject.audioButton.play();
            }
            //save localstorage
            if (localStorage.getItem('sounds')) {
                localStorage.removeItem('sounds');
                localStorage.setItem('sound', this.audioSoundName);
            } else {
                localStorage.setItem('sound', this.audioSoundName);
            }
            this.btnSound.setTexture('sound', this.audioSoundName);
        }
    }

    audioPlayButton() {
        if (this.audioSoundName === 'btn_sound.png') {
            this.audioObject.audioButton.play();
        }
    }

    setTextX(value) {
        if (value >= 100000000) this.txtMoney.x = 217;
        else if (value >= 10000000) this.txtMoney.x = 220;
        else if (value >= 1000000) this.txtMoney.x = 230;
        else if (value >= 100000) this.txtMoney.x = 240;
        else if (value >= 10000) this.txtMoney.x = 240;
        else if (value >= 1000) this.txtMoney.x = 250;
        else if (value >= 100) this.txtMoney.x = 260;
        else if (value >= 10) this.txtMoney.x = 270;
        else this.txtMoney.x = 280;
    }

    textCallback(data) {
        data.tint.topLeft = Options.hsv[Math.floor(Options.i)].color;
        data.tint.topRight = Options.hsv[359 - Math.floor(Options.i)].color;
        data.tint.bottomLeft = Options.hsv[359 - Math.floor(Options.i)].color;
        data.tint.bottomRight = Options.hsv[Math.floor(Options.i)].color;

        Options.i += 0.05;

        if (Options.i >= Options.hsv.length) {
            Options.i = 0;
        }

        return data;
    }
}