function Reels(deps, options) {
    const { globalOptions, Config, SlotClass } = deps();
    this._globalOptions = globalOptions;
    this._config = Config;
    this._SlotClass = SlotClass;
    this._scene = options.scene;
    this._options = Object.assign(this._getDefaultOptions(), options);
    this._slots = [];
    this._initalCreate();
}
Reels.prototype = {
    /**it is only called for the first time during App lifecycle */
    _initalCreate: function () {
        Array.from({ length: this._globalOptions.reelsSlotsCount + this._globalOptions.reelsHiddenSlotsCount }).map((value, i) => i)
            .forEach(slotsIndex => {
                this._slots[slotsIndex] = new this._SlotClass({
                    scene: this._scene,
                    x: this._options.x,
                    y: this._options.y + this._globalOptions.machineHeight - ((slotsIndex + 1) * this._globalOptions.slotHeight),
                    height: this._globalOptions.slotHeight,
                    gravity: 0,
                    onFall: () => { this._onFall(slotsIndex); },
                    imgName: '',
                    symbolY: this._globalOptions.slotHeight - this._globalOptions.floorHeight,
                });
            });
    },
    /**falls all slots makes their giving onFall options to be triggerd  */
    empty: function () {
        this._slots.forEach(slot => slot.fall());
    },
    /**creates all slots for the reels and indirectly makes the onReelsEnd event to trigger */
    fill: function () {
        Array.from({ length: this._globalOptions.reelsSlotsCount + this._globalOptions.reelsHiddenSlotsCount }).map((value, i) => i)
            .forEach(slotIndex => this._createSlot(slotIndex, {
                onCollide: () => this._options.onReelsEnd(slotIndex),
                imgName: '',
            }));
    },
    /**
     * @param {(slotIndex)=>void} callback executed when tumbling of reels is end
     */
    tumble: function (callback) {
        //first check if the reels need tumble or not
        const needTumble = this._slots.some((slot) => slot == null);//perviously when slot is exploded, it is set to null
        if (needTumble) {
            //first calculate remained slots
            const remainedSlots = this._slots.map((slot, i) => ({ slot, slotIndex: i }))
                .filter(({ slot, slotIndex }) => slot && (slotIndex < this._globalOptions.reelsSlotsCount));
            this._tumble(remainedSlots, callback);
        } else {
            callback();//end tumbling
        }
    },
    /**
     * @param {Array<{slot,slotIndex}>}  remainedSlots
     * @param {(slotIndex)=>void} callback executed when tumbling of reels is end
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
                    symbolY: -(this._globalOptions.floorHeight) * outsideSlotOrder,
                    onCollide: () => callback()
                });
            }
        });
    },
    _onFall: function (slotIndex) {
        this._destorySlot(slotIndex);
        this._options.onReelsStart(slotIndex);
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
            scene: this._scene,
            x: this._options.x,
            y: this._options.y - (slotsIndex * this._globalOptions.slotHeight),
            onFall: () => { this._onFall(slotsIndex); },
            gravity: this._globalOptions.symbolCollisionGravity,
            height: this._globalOptions.machineHeight,
        }, options));
    },
    _getDefaultOptions: function () {
        return {
            scene: null,
            onReelsStart: (slotIndex) => { },
            onReelsEnd: (slotIndex) => { },
            x: 0,
            y: 0
        };
    },
    getSlots: function () {
        return this._slots.map((slot, slotIndex) => ({ ...slot, slotIndex }));
    },
    update: function () {
        this._slots.forEach(slot => slot && slot.update());
    }

};
export default Reels;