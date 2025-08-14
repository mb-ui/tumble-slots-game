function Reels(deps, options) {
    const { globalOptions, Config, SlotsClass } = deps();
    this._globalOptions = globalOptions;
    this._config = Config;
    this._SlotClass = SlotsClass;
    this._options = Object.assign(this._getDefaultOptions(), options);
    this._slots = [];
    this._initalCreate();
}
Reels.prototype = {
    /**it is only called for the first time during App lifecycle */
    _initalCreate: function () {
        Array.from({ length: this._options.reelsSlotsCount }).map(i => i)
            .forEach(slotsIndex => {
                this._slots[slotsIndex] = new this._SlotClass({
                    scene: this._options.scene,
                    x: this._options.x,
                    y: this._options.y + this._options.machineHeight - (order * this._globalOptions.slotHeight),
                    height: this._globalOptions.slotHeight,
                    gravity: 0,
                    onFall: () => { this._onFall(slotsIndex); },
                    imgName: '',
                    symbolY: this._globalOptions.slotHeight / 2,
                });
            });
    },
    /**falls all slots makes their giving onFall options to be triggerd  */
    empty: function () {
        this._slots.forEach(slot => slot.setGravity(this._options.symbolFallGravity).fall());
    },
    /**creates all slots for the reels and indirectly makes the onReelsEnd event to trigger */
    fill: function () {
        Array.from({ length: this._options.reelsSlotsCount }).map(i => i)
            .forEach(slotIndex => this._createSlot(slotIndex, {
                onCollide: () => this._options.onReelsEnd(slotIndex),
                imgName: '',
                symbolY: null,
            }));
    },
    /**
     * @param {(slotIndex)=>void} callback 
     */
    tumple: function (callback) {
        //first check if the reels need tumble or not
        const needTumble = this._slots.some((slot) => slot == null);//perviously when slot is exploded, it is set to null
        if (needTumble) {
            //first calculate remained slots
            const remainedSlots = this._slots.map((slot, i) => ({ slot, slotIndex: i }))
                .filter(({ slot, slotIndex }) => slot && (slotIndex < this._globalOptions.reelsSlotsCount));
            this._tumble(remainedSlots, callback);
        } else {
            //the callback only executed when there is a tumble, so here we do not anythings
        }
    },
    /**
     * @param {Array<{slot,slotIndex}>}  remainedSlots
     * @param {(slotIndex)=>void} callback 
     */
    _tumble: function (remainedSlots, callback) {
        let outsideSlotOrder = 0;
        Array.from({ length: this._globalOptions.reelsSlotsCount }).map((value, i) => i).forEach((i) => {
            const remainCell = remainedSlots[i];
            if (remainCell) {
                const slot = this._slots[remainCell.slotIndex];
                const existingImgName = slot.imgName;
                const transition = remainCell.slotIndex - i;
                if (transition > 0) {
                    this._destorySlot(remainCell.slotIndex);
                    this._createSlot(i,
                        {
                            symbolY: this._globalOptions.machineHeight - (transition * this._globalOptions.slotHeight),
                            imgName: existingImgName
                        }
                    );
                }
            } else {
                outsideSlotOrder++;
                this._createSlot(i, {
                    symbolY: -10 * (outsideSlotOrder + 1),//todo (this._globalOptions.slotHeight*outsideSlotOrder should be replaced)
                    onCollide: () => setTimeout(() => callback(i), 500/**todo */)
                });
            }
        });
    },
    _onFall: function (slotIndex) {
        this._destorySlot(slotIndex);
        this._options.onReelsStart();
    },
    _destorySlot: function (slotIndex) {
        const slot = this._slots[slotIndex];
        slot && slot.destroy && slot.destroy();
        this._slots[slotIndex] = null;
    },
    explode: function (slotIndex, callback) {
        const slot = this._slots[slotIndex];
        slot.explode(() => {
            this._destorySlot(slotIndex);
            callback();
        });
    },
    _createSlot: function (slotsIndex, options) {
        this._slots[slotsIndex] = new this._SlotClass(Object.assign({
            scene: this._options.scene,
            x: this._options.x,
            y: this._options.y - (order * this._globalOptions.slotHeight),
            onFall: () => { this._onFall(slotsIndex); },
            gravity: this._options.symbolCollisionGravity,
            height: this._options.machineHeight,
        }, options));
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
    update: function () {
        this._slots.forEach(slot => slot.update());
    }

};
export default Reels;