import Config from '../config';
import Options from '../options';
//import Class
import Audio from '../components/Audio';
import Sprite from '../adapters/Sprite';
import Slots from '../components/slots/slots.factory';
import PayTable from '../components/payTable/payTable.factory';
import Maxbet from '../components/Maxbet';
import SpinButton from '../components/spinButton/spinButton.factory';
import CreditBoard from '../components/creditBoard/creditBoard.factory';
import ScoreBoard from '../components/scoreBoard/scoreBoard.factory';
import Hero from '../components/hero/hero.factory';
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
        new Sprite(this, Config.width / 2, Config.height / 2, 'background', 'bg.jpg').setDepth(-1);
        //container
        this.slots = new Slots(this);
        //add image machine
        new Sprite(this, Config.width / 2, Config.height / 2, 'background', 'machine.png').setDepth(0);
        // add Hero
        new Hero(this);
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
        new PayTable(this);
        new SpinButton(this);
        new CreditBoard(this);
        new ScoreBoard(this);
    }
    update() {
        this.slots.update();
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
}