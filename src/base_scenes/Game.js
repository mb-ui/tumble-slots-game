import Config from '../config';
import Options from '../options';
import Audio from '../components/audio/audio.factory';
import Sprite from '../adapters/Sprite';
import Machine from '../components/machine/machine.factory';
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
        prison.setScale(Options.machineWidth / Config.width, Options.machineHeight / Config.height);
        const prisonSkeleton = new Sprite(this, Config.width / 2 + 8, Config.height / 2 + 30, 'prisonSkeleton').setDepth(4);
        prisonSkeleton.setScale(Options.machineWidth / Config.width, Options.machineHeight / Config.height);
        // Machine
        this._createMachine();

        //add bg image
        const background = new Sprite(this, 0, 0, 'prisonBg').setDepth(0);
        background.setScale(1);
        background.setOrigin(0, 0);
        background.displayWidth = this.scale.width;
        background.displayHeight = this.scale.height;

        // const table = this.add.graphics();
        // table.lineStyle(2, 0xFF0000, 1);
        // table.strokeRect(
        //     Options.machineX,
        //     Options.machineY,
        //     Options.machineWidth,
        //     Options.machineHeight
        // );
        // table.setDepth(4);

        new Hero(this);
        new Maxbet({ scene: this });
        new PayTable(this);
        //spin button
        this._createSpinButton();
        //credit board
        this._createCreditBoard();
        //score Board
        this._createScoreBoard();
        // Audio
        new Audio(this).createButton();
    }
    update() {
        this.machine.update();
    }
    _createMachine() {
        const machine = new Machine({
            scene: this,
            onReady: () => eventsAdapter.emit(eventsAdapter.eventsEnum.onIdle),
            onReelsStart: (reelsIndex) => {
                eventsAdapter.emit(eventsAdapter.eventsEnum.onReelsStart, reelsIndex);
            },
            onReelsEnd: function (reelsIndex) {
                eventsAdapter.emit(eventsAdapter.eventsEnum.onReelsEnd, reelsIndex);
                // check if the last Reels is end then trigger onSpinEnd
                reelsIndex == Options.reelsCount - 1 &&
                    eventsAdapter.emit(eventsAdapter.eventsEnum.onSpinEnd, this.getSlots());
            },
            /**
             * @param {Array<{ reelsIndex, slotIndex }>} winners 
             * @param {{ reelsIndex, slotIndex }} destroyedSlotInfo 
             */
            onTumple: function (winners, destroyedSlotInfo) {
                const lastWinner = winners[winners.length - 1];
                JSON.stringify(lastWinner) === JSON.stringify(destroyedSlotInfo) && eventsAdapter.emit(eventsAdapter.eventsEnum.onTumpleEnd, this.getSlots());
            },
            onExplod: function () { eventsAdapter.emit(eventsAdapter.eventsEnum.onExplode); }
        });
        eventsAdapter.on(eventsAdapter.eventsEnum.onSpinStart, function () { this.reels(); }, machine);
        eventsAdapter.on(eventsAdapter.eventsEnum.onWin, function ({ winners }) { this.tumble(winners); }, machine);
    }
    _createSpinButton() {
        const spinButton = new SpinButton({
            scene: this,
            isPending: false,//inital state
            onClick: () => {
                eventsAdapter.emit(eventsAdapter.eventsEnum.onButtonClick);
                eventsAdapter.emit(eventsAdapter.eventsEnum.onSpinStart);
            }
        });
        eventsAdapter.on(eventsAdapter.eventsEnum.onReady, function () { this.ready(); }, spinButton);
        eventsAdapter.on(eventsAdapter.eventsEnum.onIdle, function () { this.ready(); }, spinButton);
    }
    _createCreditBoard() {
        const creditBoard = new CreditBoard({ scent: this });
        eventsAdapter.on(eventsAdapter.eventsEnum.onSpinStart, function () { this.bet(); }, creditBoard);
        eventsAdapter.on(eventsAdapter.eventsEnum.onWin, function ({ score }) { this.win(score); }, creditBoard);
    }
    _createScoreBoard() {
        const scoreBoard = new ScoreBoard({ scene: this });
        eventsAdapter.on(eventsAdapter.eventsEnum.onLose, function () { this.clear(); }, scoreBoard);
        eventsAdapter.on(eventsAdapter.eventsEnum.onWin, function ({ score }) { this.addScore(score); }, scoreBoard);
    }
}