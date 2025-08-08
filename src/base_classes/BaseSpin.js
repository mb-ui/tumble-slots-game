import Config from '../config';
import Options from '../options';
//import Class
import Sprite from './Sprite';
import Tween from './Tween';
import explode from './explode';
//Class Base Spin
export default class BaseSpin {
    constructor(scene) {
        this.scene = scene;
        this.addSpin();
    }

    addSpin() {
        this.bgSpin = new Sprite(this.scene, Config.width - 275, Config.height - 50, 'bgButtons', 'btn-spin.png');
        this.bgSpin.setDepth(1);
        //text spin
        this.txtSpin = this.scene.add.dynamicBitmapText(Config.width - 315, Config.height - 70, 'txt_bitmap', Options.txtSpin, 38);
        this.txtSpin.setDepth(1);
        this.txtSpin.setDisplayCallback(this.scene.textCallback);
        this.bgSpin.on('pointerdown', this.playTweens, this);
        this.bgSpin.on('pointerup', () => this.bgSpin.setScale(1));
    }

    playTweens() {
        //this.scene.containers.empty(); return;
        const con = this.scene.containers.getContainer(1, 1);
        explode(this.scene, con, {
            onDestroy: () => {
                this.scene.containers.tumbles()
            }
        });
        if (!Options.checkClick && this.scene.valueMoney >=
            (Options.coin * Options.line) && Options.txtAutoSpin === 'AUTO') {
            //detroy line array
            this.destroyLineArr();
            //setTint
            this.setColor();
            Options.checkClick = true;
            this.bgSpin.setScale(0.9);
            //funtion remove text win
            this.removeTextWin();
            //save localStorage
            this.saveLocalStorage();
            //Class Tween
            //this.tweens = new Tween(this.scene);

        }
    }

    destroyLineArr() {
        if (Options.lineArray.length > 0) {
            for (let i = 0; i < Options.lineArray.length; i++) {
                Options.lineArray[i].destroy();
            }
            Options.lineArray = [];
        }
    }

    removeTextWin() {
        //play audio button
        this.scene.audioPlayButton();

        if (this.scene.audioMusicName === 'btn_music.png') {
            //stop audio win
            this.scene.audioObject.audioWin.stop();
            this.scene.audioObject.audioReels.play();
        }
        // play animation
        // const sixMealManSpine = this.scene.data.scene.sixMealManSpine;
        // if (sixMealManSpine.animationState.tracks[0].animation.name !== "Idle Smile") {
        //     sixMealManSpine.animationState.setAnimation(0, "Idle Smile", true);
        // }
        //set money
        this.scene.valueMoney -= (Options.coin * Options.line);
        this.scene.txtMoney.setText(this.scene.valueMoney + '$');
        //remove text txtwin
        if (this.scene.txtWin) {
            this.scene.txtWin.destroy();
        }
    }

    setColor() {
        this.bgSpin.setTint(0xa09d9d);
        this.scene.autoSpin.buttonAuto.setTint(0xa09d9d);
        this.scene.maxBet.maxBet.setTint(0xa09d9d);
        this.scene.coin.coin.setTint(0xa09d9d);
        this.scene.btnLine.btnLine.setTint(0xa09d9d);
        this.scene.btnMusic.setTint(0xa09d9d);
        this.scene.btnSound.setTint(0xa09d9d);
    }

    saveLocalStorage() {
        if (localStorage.getItem('money')) {
            localStorage.removeItem('money');
            localStorage.setItem('money', this.scene.valueMoney);
        }
        localStorage.setItem('money', this.scene.valueMoney);
        this.scene.setTextX(this.scene.valueMoney);
        this.scene.txtMoney.setText(this.scene.valueMoney + '$');
    }
}