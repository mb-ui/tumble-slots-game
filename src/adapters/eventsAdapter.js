class EventBus extends Phaser.Events.EventEmitter {
    constructor() {
        super();
        /**contains all custom events through the App */
        this.eventsEnum = {
            /**this is initial event and indicates that initial slots animation has finished and slots are ready */
            ready: "ready",
            idle: "idle",
            spinStart: "spinStart",
            spinEnd: "spinEnd",
            explodeStart: "explodeStart",
            explodEnd: "explodEnd",
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
        return super.on(ev, args);
    }
    once(ev, fn, ctx) {
        this._checkIfEventExisted(ev);
        return super.once(ev, fn, ctx);
    }
}
/**this Adapter implements Phaser.Events.EventEmitter and extends it for new property eventsEnum */
const EventsAdapter = new EventBus();

export default EventsAdapter;