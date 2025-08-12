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
        new Sprite(this, Config.width / 2, Config.height / 2, 'background', 'bg.jpg').setDepth(-1);//add bg image
        this.slots = new Slots(this);
        new Sprite(this, Config.width / 2, Config.height / 2, 'background', 'machine.png').setDepth(0);//add image machine
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