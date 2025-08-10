//Class Base Spin
export default class BaseSpin {
    constructor(deps, scene) {
        this.scene = scene;
        const { globalOptions, Sprite, Config, pub_sub } = deps();
        this._globalOptions = globalOptions;
        this.SpinButton = new Sprite(this.scene, Config.width - 275, Config.height - 50, 'bgButtons', 'btn-spin.png');
        this.SpinButton.setDepth(1);
        //text spin
        this.txtSpin = this.scene.add.dynamicBitmapText(Config.width - 315, Config.height - 70, 'txt_bitmap', this._globalOptions.txtSpin, 38);
        this.txtSpin.setDepth(1);
        this._isPending = true;
        this.txtSpin.setDisplayCallback(this.scene.textCallback);
        this.SpinButton.on('pointerdown', () => { this.SpinButton.setScale(0.9); this.spin(); }, this);
        this.SpinButton.on('pointerup', () => this.SpinButton.setScale(1));
        pub_sub.on('onReady', () => { this.ready(); });
        pub_sub.on('onFail', () => { this.ready(); });
        this._pub_sub = pub_sub;
    }


    spin() {
        if (this._isPending) { return }
        //this.scene.containers.empty();
        this._pub_sub.trigger('onClick');
        this._pub_sub.trigger('onBet');
        this._pub_sub.trigger('onSpin');

        //funtion remove text win
        //this.removeTextWin();
        this.pending();
    }
    pending() {
        this._isPending = true;
        this.SpinButton.setTint(0xa09d9d);
    }
    ready() {
        this._isPending = false;
        this.SpinButton.clearTint();
    }

    removeTextWin() {
        //play audio button
        // this.scene.audioPlayButton();

        // if (this.scene.audioMusicName === 'btn_music.png') {
        //     //stop audio win
        //     this.scene.audioObject.audioWin.stop();
        //     this.scene.audioObject.audioReels.play();
        // }
        // // play animation
        // // const sixMealManSpine = this.scene.data.scene.sixMealManSpine;
        // // if (sixMealManSpine.animationState.tracks[0].animation.name !== "Idle Smile") {
        // //     sixMealManSpine.animationState.setAnimation(0, "Idle Smile", true);
        // // }
        // //set money
        // this.scene.valueMoney -= (this._globalOptions.bet);
        // this.scene.txtMoney.setText(this.scene.valueMoney + '$');
        // //remove text txtwin
        // if (this.scene.txtWin) {
        //     this.scene.txtWin.destroy();
        // }
    }

    setColor() {
        // this.SpinButton.setTint(0xa09d9d);
        // this.scene.maxBet.maxBet.setTint(0xa09d9d);
        // this.scene.btnMusic.setTint(0xa09d9d);
        // this.scene.btnSound.setTint(0xa09d9d);
    }
}