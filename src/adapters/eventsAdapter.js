import fsmAdapter from './fsmAdapter';
export class EventBus extends Phaser.Events.EventEmitter {
    constructor(fsmAdapter) {
        super();
        this.fsm = fsmAdapter;
        /**contains all custom events through the App */
        this.eventsEnum = {
            /**this is initial event and indicates that initial animation of slots animation has finished and slots are ready */
            onIdle: "onIdle",
            onButtonClick: "onButtonClick",
            onSpinStart: "onSpinStart",
            onReelsStart: "onReelsStart",
            onReelsEnd: "onReelsEnd",
            onSpinEnd: "onSpinStart",
            onLose: "onLose",
            onWin: "onWin",
            onTumple: "onTumple",
            onTumpleEnd: "onTumpleEnd",
            onExplode: "onExplode",
        };
    }

    _checkIfEventExisted(ev) {
        if (this.eventsEnum.hasOwnProperty(ev) === true) {
            throw new Error(`the ${ev} is not defined in eventAdatper.js`);
        }
    }
    on(ev, fn, ctx) {
        this._checkIfEventExisted(ev);
        return super.on(ev, fn, ctx);
    }
    emit(ev, args) {
        this._checkIfEventExisted(ev);
        return super.on.apply(this, [ev, ...args, () => getState()]);
    }
    once(ev, fn, ctx) {
        this._checkIfEventExisted(ev);
        return super.once(ev, fn, ctx);
    }
    getState() {
        return this.fsm.state;
    }
}
/**this Adapter implements Phaser.Events.EventEmitter and extends it for new property eventsEnum */
const EventsAdapter = new EventBus(fsmAdapter);
//change state from "idle" to "spinning"
//EventsAdapter.on(EventsAdapter.eventsEnum.onReelsStart, function () { this.fsm.spin(); }, EventsAdapter);
//change state from "spinning" to "evaluation"
//EventsAdapter.on(EventsAdapter.eventsEnum.onReelsEnd, function () { this.fsm.spinComplete(); }, EventsAdapter);
//change state from "evaluation" to "idle"
//EventsAdapter.on(EventsAdapter.eventsEnum.onLose, function () { this.fsm.fail(); }, EventsAdapter);
//change state from "evaluation" to "win"
//EventsAdapter.on(EventsAdapter.eventsEnum.onWin, function () { this.fsm.success(); }, EventsAdapter);
//change state from "win" to "tumpling"
//EventsAdapter.on(EventsAdapter.eventsEnum.onWin, function () { this.fsm.tumple(); }, EventsAdapter);
//change state from "tumpling" to "evaluation"
//EventsAdapter.on(EventsAdapter.eventsEnum.onTumpleEnd, function () { this.fsm.tumbleComplete(); }, EventsAdapter);

export default EventsAdapter;