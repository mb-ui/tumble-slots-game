export default class Info {
    constructor(deps, scene) {
        const { globalOptions, Config, Sprite } = deps(scene);
        this._globalOptions = globalOptions;
        this._config = Config;
        this._Sprite = Sprite;
        this._scene = scene;
        this.addInfo();
        this.click = false;
    }

    addInfo() {
        this.info = new this._Sprite(this._scene, this._config.width - 1020, this._config.height - 50, 'bgButtons', 'btn-info.png');
        //add bitmap text
        const txtInfo = this._scene.add.dynamicBitmapText(this._config.width - 1060, this._config.height - 70, 'txt_bitmap', this._globalOptions.txtInfo, 38);
        txtInfo.setDisplayCallback(this._scene.textCallback);
        this.info.on('pointerdown', this.showPayTable, this);
    }

    showPayTable() {
        if (!this.click) {
            //set click = true
            this.click = true;
            //play audio button
            this._scene.audioPlayButton();
            //function show table
            this.showTable();
            this.btnExit = new this._Sprite(this._scene, this._config.width - 30,
                this._config.height - 635, 'bgButtons', 'btn_exit.png').
                setScale(0.9).setDepth(1);
            this.btnExit.on('pointerdown', this.deleteTable, this);
        }
    }

    showTable() {
        this.payValues = [];

        this.paytable = new this._Sprite(this._scene, this._config.width / 2, this._config.height / 2,
            'about', 'paytable.png').setDepth(1);

        var width = 190, width2 = width, height = 25, height2 = 245;

        for (let i = 0; i < this._globalOptions.payvalues.length; i++) {
            if (i >= 5) {
                for (let j = 0; j < this._globalOptions.payvalues[i].length; j++) {
                    height2 -= 30;
                    this.payValues.push(this._scene.add.text(width2, this._config.height / 2 + height2, this._globalOptions.payvalues[i][j], {
                        fontSize: '30px',
                        color: '#630066',
                        fontFamily: 'PT Serif'
                    }).setDepth(1));
                }
                width2 += 225;
                height2 = 245;
            } else {
                for (let j = 0; j < this._globalOptions.payvalues[i].length; j++) {
                    height += 30;
                    this.payValues.push(this._scene.add.text(width, this._config.height / 2 - height, this._globalOptions.payvalues[i][j], {
                        fontSize: '30px',
                        color: '#630066',
                        fontFamily: 'PT Serif'
                    }).setDepth(1));
                }
                width += 225;
                height = 25;
            }
        }
    }

    deleteTable() {
        //set click = false
        this.click = false;
        //play audio button
        this._scene.audioPlayButton();
        this.paytable.destroy();
        this.btnExit.destroy();
        if (this.payValues.length > 0) {
            for (let i = 0; i < this.payValues.length; i++) {
                this.payValues[i].destroy();
            }
        }
    }
}