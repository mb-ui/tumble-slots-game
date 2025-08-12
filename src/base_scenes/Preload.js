import Config from '../config';

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Preload' });
    }

    preload() {
        this.load.path = '../../assets/';
        // load spritesheets
        this.load.spritesheet('explode', 'images/symbols/explode.png', { frameWidth: 291.71, frameHeight: 312, endFrame: 6 });
        // load spine        

        this.load.spineJson("hero", "spine/heros/heroes.json");
        this.load.spineAtlas("hero-atlas", "spine/heros/heroes.atlas");
        //load image
        this.load.atlas('logo', 'images/logo/logo.png', 'images/logo/logo.json');
        this.load.atlas('about', 'images/about/about.png', 'images/about/about.json');
        this.load.atlas('background', 'images/bg/bg.png', 'images/bg/bg.json');
        this.load.atlas('bgPreload', 'images/bg/bgmenu.png', 'images/bg/bgmenu.json');
        this.load.atlas('bgButtons', 'images/buttons/button.png', 'images/buttons/button.json');
        this.load.atlas('symbols', 'images/symbols/symbols.png', 'images/symbols/symbols.json');
        this.load.atlas('symbols_blur', 'images/symbols/symbols_blur.png', 'images/symbols/symbols_blur.json');
        this.load.atlas('sound', 'images/sound/sound.png', 'images/sound/sound.json');
        this.load.bitmapFont('txt_bitmap', 'fonts/bitmap/text_slot_machine.png', 'fonts/bitmap/text_slot_machine.xml');
        //load audio
        this.load.audio('backgroundDefault', 'audio/background-default.mp3');
        this.load.audio('win', 'audio/win.mp3');
        this.load.audio('button', 'audio/button.mp3');
        this.load.audio('bubble2', 'audio/bubble2.mp3');
        this.load.audio('fall0', 'audio/fall0.mp3');
        this.load.audio('explode0', 'audio/explode0.mp3');

        this.progressBar = this.add.graphics();
        this.progressBox = this.add.graphics();
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(Config.width / 2 - 460, Config.height / 2 - 90, 900, 50);
        //load text
        this.loadingText = this.make.text({
            x: Config.width / 2,
            y: Config.height / 2 - 5,
            text: '0%',
            style: {
                font: '30px PT Serif',
                fill: '#ffffff'
            }
        });
        this.loadingText.setOrigin(0.5, 0.5);
        this.load.on('progress', (value) => {
            this.progressBar.clear();
            this.progressBar.fillStyle(0xff00ff, 1);
            this.progressBar.fillRect(Config.width / 2 - 450, Config.height / 2 - 80, 880 * value, 30);
            this.loadingText.setText(parseInt(value * 100) + '%');
        });
        this.load.on('complete', this.onComplete, this);
        for (let i = 0; i < 100; i++) {
            this.load.atlas('background' + i, 'images/bg/bg.png', 'images/bg/bg.json');
        }
    }

    create() {
        this.scene.start('Boot');
    }


    onComplete() {
        this.progressBar.destroy();
        this.progressBox.destroy();
        this.loadingText.destroy();
    }
}