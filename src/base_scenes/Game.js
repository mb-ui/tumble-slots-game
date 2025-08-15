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
import Evaluation from '../components/evaluation/evaluation.factory';
export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    create() {
        //add image machine
        const prison = new Sprite(this, Config.width / 2 + 8, Config.height / 2 + 30, 'prison').setDepth(-2);
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
        // add Hero
        new Hero(this);
        new Maxbet({ scene: this });
        //PayTable todo
        //new PayTable(this);
        //evalution action
        this._evaluation();
        //spin button
        this._createSpinButton();
        //credit board
        this._createCreditBoard();
        //score Board
        this._createScoreBoard();
        // Audio todo
        //new Audio(this).createButton();
    }
    update(time) {
        // if (time > 30) {
        //     this.events.emit('onUpdate'); // todo
        // }
        eventsAdapter.emit(eventsAdapter.eventsEnum.onUpdate);
    }
    _createMachine() {
        const machine = new Machine({
            scene: this,
            /**reels start means falling reels slots from the machin */
            onReelsStart: (reelsIndex, slotIndex) => {
                eventsAdapter.emit(eventsAdapter.eventsEnum.onReelsStart, reelsIndex, slotIndex);
            },
            /**reels end means collide reels slots with buttom of machin */
            onReelsEnd: function (reelsIndex, slotIndex) {
                eventsAdapter.emit(eventsAdapter.eventsEnum.onReelsEnd, reelsIndex, slotIndex);
                // check if the last slot in last Reels is ended then trigger onSpinEnd
                reelsIndex == Options.reelsCount - 1 && slotIndex == Options.reelsSlotsCount - 1 &&
                    eventsAdapter.emit(eventsAdapter.eventsEnum.onSpinEnd, this.getSlots());
            },
            /**
             * @param {Array<{ reelsIndex, slotIndex }>} winners 
             * @param {{ reelsIndex, slotIndex }} destroyedSlotInfo 
             */
            onTumbleEnd: function () { eventsAdapter.emit(eventsAdapter.eventsEnum.onTumbleEnd, this.getSlots()); },
            onExplod: function () { eventsAdapter.emit(eventsAdapter.eventsEnum.onExplode); }
        });
        eventsAdapter.on(eventsAdapter.eventsEnum.onUpdate, function () { this.update(); }, machine);
        eventsAdapter.on(eventsAdapter.eventsEnum.onSpinStart, function () { this.emptyReels(); }, machine);
        eventsAdapter.on(eventsAdapter.eventsEnum.onReelsStart, function (reelsIndex, slotIndex) {
            //calling fillReels method only after starting of last reels
            //reels starting here means falling reels slots from the machine
            if (reelsIndex === this._globalOptions.reelsCount - 1 && slotIndex === 0) { this.fillReels(); }
        }, machine);
        eventsAdapter.on(eventsAdapter.eventsEnum.onWin, function ({ winners }) { this.tumble(winners); }, machine);
    }
    _createSpinButton() {
        const spinButton = new SpinButton({
            scene: this,
            onClick: () => {
                eventsAdapter.emit(eventsAdapter.eventsEnum.onButtonClick);
                eventsAdapter.emit(eventsAdapter.eventsEnum.onSpinStart);
            }
        });
        eventsAdapter.on(eventsAdapter.eventsEnum.onIdle, function () { this.ready(); }, spinButton);
    }
    _createCreditBoard() {
        const creditBoard = new CreditBoard({ scene: this });
        eventsAdapter.on(eventsAdapter.eventsEnum.onSpinStart, function () { this.bet(); }, creditBoard);
        eventsAdapter.on(eventsAdapter.eventsEnum.onWin, function ({ score }) { this.win(score); }, creditBoard);
    }
    _createScoreBoard() {
        const scoreBoard = new ScoreBoard({ scene: this });
        eventsAdapter.on(eventsAdapter.eventsEnum.onLose, function () { this.clear(); }, scoreBoard);
        eventsAdapter.on(eventsAdapter.eventsEnum.onWin, function ({ score }) { this.addScore(score); }, scoreBoard);
    }
    _evaluation() {
        const evaluation = new Evaluation({
            scene: this,
            onSuccess: ({ winners, score }) => {
                eventsAdapter.emit(eventsAdapter.eventsEnum.onWin, { winners, score });
            },
            onFail: () => {
                eventsAdapter.emit(eventsAdapter.eventsEnum.onLose);
                eventsAdapter.emit(eventsAdapter.eventsEnum.onIdle);
            }
        });
        eventsAdapter.on(eventsAdapter.eventsEnum.onSpinEnd, function (slotsInfo) { this.evaluate(slotsInfo); }, evaluation);
        eventsAdapter.on(eventsAdapter.eventsEnum.onTumbleEnd, function (slotsInfo) { this.evaluate(slotsInfo); }, evaluation);
    }
}