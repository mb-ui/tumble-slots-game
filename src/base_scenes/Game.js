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
import eventsAdapter from '../adapters/eventsAdapter';
export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    create() {
        //add image machine
        const prison = new Sprite(this, Config.width / 2 + 8, Config.height / 2 + 30, 'prison').setDepth(-1);
        prison.setScale(Options.tableWidth / Config.width, Options.tableHeight / Config.height);
        const pipe = new Sprite(this, Config.width / 2 + 8, Config.height / 2 + 30, 'prisonSkeleton').setDepth(4);
        pipe.setScale(Options.tableWidth / Config.width, Options.tableHeight / Config.height);

        this.slots = new Slots(this);


        //add bg image
        const background = new Sprite(this, 0, 0, 'prisonBg').setDepth(0);
        background.setScale(1);
        background.setOrigin(0, 0);
        background.displayWidth = this.scale.width;
        background.displayHeight = this.scale.height;

        // const table = this.add.graphics();
        // table.lineStyle(2, 0xFF0000, 1);
        // table.strokeRect(
        //     Options.tableX,
        //     Options.tableY,
        //     Options.tableWidth,
        //     Options.tableHeight
        // );
        // table.setDepth(4);

        new Hero(this);
        new Maxbet(this);
        new PayTable(this);
        //spin button
        const spinButton = new SpinButton({
            scene: this,
            isPending: false,//inital state
            onClick: eventsAdapter.emit(eventsAdapter.eventsEnum.onReelsStart)
        });
        eventsAdapter.on(eventsAdapter.eventsEnum.onReady, function () { this.ready(); }, spinButton);
        eventsAdapter.on(eventsAdapter.eventsEnum.onIdle, function () { this.ready(); }, spinButton);
        //credit board
        new CreditBoard(this);
        new ScoreBoard(this);
        new Audio(this).createButton();
    }
    update() {
        this.slots.update();
    }
}