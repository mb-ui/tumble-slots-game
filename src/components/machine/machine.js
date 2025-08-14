function Machine(deps, options) {
    const { globalOptions, Config, ReelsClass } = deps();
    this._globalOptions = globalOptions;
    this._config = Config;
    this._ReelsClass = ReelsClass;
    this._options = Object.assign(this._getDefaultOptions(), options);
    this.ready = false;
    this._reels = [];
    this._init();
}
Machine.prototype = {
    _getDefaultOptions: function () {
        return {
            scene: null,
            onReelsStart: (reelsIndex, slotIndex) => { },
            onReelsEnd: (reelsIndex, slotIndex) => { },
            onTumple: () => { },
            onExplode: () => { }
        };
    },
    /**_init method only executed once at initally and create reels instances */
    _init: function () {
        Array.from({ length: this._options.reelsCount }).map(i => i).forEach(reelsIndex => {
            this._reels[reelsIndex] = new this._ReelsClass({
                scene: this._options.scene,
                onReelsStart: (slotIndex) => this._options.onReelsStart(reelsIndex, slotIndex),
                onReelsEnd: (slotIndex) => this._options.onReelsEnd(reelsIndex, slotIndex),
                y: this._globalOptions.machineY,
                x: this._globalOptions.machineX + (reelsIndex * this._globalOptions.reelsWidth)
            });
        });
    },
    /**calls reels.fill() based on delayNextReelsStart option */
    fillReels: function (reelsIndex = 0) {
        if (reelsIndex <= this._globalOptions.reelsCount - 1) {
            this._reels[reelsIndex].fill();
            reelsIndex++;
            setTimeout(() => { this.fillReels(reelsIndex); }, this._globalOptions.delayNextReelsStart);
        }
    },
    /**calls reels.empty() based on delayNextReelsStart option */
    emptyReels: function (reelsIndex = 0) {
        if (reelsIndex <= this._globalOptions.reelsCount - 1) {
            this._reels[reelsIndex].empty();
            reelsIndex++;
            setTimeout(() => { this.emptyReels(reelsIndex); }, this._globalOptions.delayNextReelsStart);
        }
    },
    /**
     * first explods and destroys winners slots and then check remianed slots for animation
     * @param {Array<{ reelsIndex, slotIndex, imgName }>} winners 
     */
    tumble: function (winners) {
        this._explodes(winners, () => this._tumble());
    },
    _tumble: function (winners) {
        const winnersCopy = [...winners];
        //loop on reels and call each reels[reelsIndex].tumble with callback
        this._reels.forEach((reels, reelsIndex) => {
            reels.tumble((slotIndex) => this._options.onTumple(winnersCopy, { slotIndex, reelsIndex }));
        });
    },
    /**
     * explodes slot and then set reels[slotIndex] to null
     * @param {Array<{ reelsIndex, slotIndex }>} winners 
     * @param {()=>void} callback is fired when last slot is exploded
     */
    _explodes: function (condidates, callback) {
        for (let i = 0, length = condidates.length, lastIndex = length - 1; i <= lastIndex; i++) {
            const { reelsIndex, slotIndex } = condidates[i];
            this._reels[reelsIndex].explode(slotIndex, () => {
                if (i == lastIndex) {
                    this._options.onExplode();
                    callback()
                }
            });
        }
    },
    getSlots: function () {
        return this._reels.reduce((ac, reels, reelsIndex) =>
            ac.concat(reels.getSlots().map(slot => ({ ...slot, reelsIndex }))), []);
    },
    update: function () {
        this._reels.forEach(reels => reels.update());
    }
};
export default Machine;