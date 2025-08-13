import Config from '../config';
import Options from '../options';
import Audio from '../components/audio/audio.factory';
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
        Options.hsv = Phaser.Display.Color.HSVColorWheel();// bitmap text

        //add image machine

        const prison = new Sprite(this, Config.width / 2 + 8, Config.height / 2 + 30, 'prison').setDepth(-1);
        prison.setScale(0.628);
        const pipe = new Sprite(this, Config.width / 2 + 8, Config.height / 2 + 30, 'pipe').setDepth(4);//add bg image
        pipe.setScale(0.628);

        this.slots = new Slots(this);

        //add bg image
        const background = new Sprite(this, 0, 0, 'prisonBg').setDepth(0);
        background.setScale(1);
        background.setOrigin(0, 0);
        background.displayWidth = this.scale.width;
        background.displayHeight = this.scale.height;
        //background.alpha = 0.7;
        //background.postFX.addBlur(0.02);


        new Hero(this);
        new Maxbet(this);
        new PayTable(this);
        new SpinButton(this);
        new CreditBoard(this);
        new ScoreBoard(this);
        new Audio(this).createButton();
    }
    update() {
        this.slots.update();
    }
}