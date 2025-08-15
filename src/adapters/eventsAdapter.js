import fsmAdapter from './fsmAdapter';
export class EventBus extends Phaser.Events.EventEmitter {
    constructor(fsmAdapter) {
        super();
        this.fsm = fsmAdapter;
        /**contains all custom events through the App */
        this.eventsEnum = {
            /**this is initial event and indicates that initial animation of slots animation has finished and slots are ready */
            onIdle: "onIdle",
            onUpdate: "onUpdate",
            onButtonClick: "onButtonClick",
            onSpinStart: "onSpinStart",
            onReelsStart: "onReelsStart",
            onReelsEnd: "onReelsEnd",
            onSpinEnd: "onSpinEnd",
            onLose: "onLose",
            onWin: "onWin",
            onTumple: "onTumple",
            onTumpleEnd: "onTumpleEnd",
            onExplode: "onExplode",
        };
    }

    _checkIfEventExisted(ev) {
        if (this.eventsEnum.hasOwnProperty(ev) === false) {
            throw new Error(`the ${ev} is not defined in eventAdatper.js`);
        }
    }
    on(ev, fn, ctx) {
        this._checkIfEventExisted(ev);
        return super.on(ev, fn, ctx);
    }
    emit(ev, ...args) {
        this._checkIfEventExisted(ev);
        const params = [...args];
        params.push(() => getState())
        return super.emit.apply(this, [ev, ...params]);
    }
    once(ev, fn, ctx) {
        this._checkIfEventExisted(ev);
        return super.once(ev, fn, ctx);
    }
    getState() {
        return this.fsm.state;
    }
}
const EventsAdapter = new EventBus(fsmAdapter);

export default EventsAdapter;