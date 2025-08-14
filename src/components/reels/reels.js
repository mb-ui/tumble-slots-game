function Reels(deps, options) {
    const { globalOptions, Config, SlotsClass } = deps();
    this._globalOptions = globalOptions;
    this._config = Config;
    this._SlotsClass = SlotsClass;
    this._options = Object.assign(this._getDefaultOptions(), options);
    this._slots = [];
    this._creatSlots();
}
Reels.prototype = {
    tumple: function () {

    },
    _creatSlots: function () {
        Array.from({ length: this._options.reelsSlotsCount }).map(i => i).forEach(i => {
            this._slots.push(this._SlotsClass.createSlot({
                scene: this._options.scene,
                x: this._options.x,
                y: this._options.y - (order * this._globalOptions.slotHeight),
                onFall: () => { },
                onCollide: () => { },
                imgName: '',
                symbolY: null,
            }));
        });
    },
    _getDefaultOptions: function () {
        return {
            scene: null,
            onReelsStart: () => { },
            onReelsEnd: () => { },
            x: 0,
            y: 0
        };
    },
    getSlots: function () {
        return this._slots.map((slot, slotIndex) => ({ ...slot, slotIndex }));
    },

};
export default Reels;