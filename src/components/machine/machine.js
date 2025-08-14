function Machine(deps, options) {
    const { globalOptions, Config, ReelsClass } = deps();
    this._globalOptions = globalOptions;
    this._config = Config;
    this._ReelsClass = ReelsClass;
    this._options = Object.assign(this._getDefaultOptions(), options);
    this.ready = false;
    this._reels = [];
}
Machine.prototype = {
    _getDefaultOptions: function () {
        return {
            scene: null,
            onReady: () => { },
            onReelsStart: () => { },
            onReelsEnd: () => { },
            onTumple: () => { }
        };
    },
    reels: function (reelsIndex = 0) {
        if (reelsIndex == 0) {
            this._reels = [];
        }
        this._reels.push(new this._ReelsClass({
            scene: this._options.scene,
            onReelsStart: (reelsIndex) => this._options.onReelsStart(reelsIndex),
            onReelsEnd: (reelsIndex) => this._onReelsEnd(reelsIndex),
            y: this._globalOptions.machineY,
            x: this._globalOptions.machineX + (reelsIndex * this._globalOptions.reelsWidth)
        }));
        setTimeout(() => {
            reelsIndex++;
            reelsIndex <= this._globalOptions.reelsCount - 1 && this.reels(reelsIndex);
        }, this._globalOptions.delayNextReelsStart)
    },
    tumble: function (winners) {
        const winnersCopy = [...winners];
        winners.forEach((winner, i) => this._reels[winner.reelsIndex].tumble({ ...winner }, () => this._options.onTumple(winnersCopy, winner)));
    },
    getSlots: function () {
        return this._reels.reduce((ac, reels, reelsIndex) =>
            ac.concat(reels.getSlots().map(slot => ({ ...slot, reelsIndex }))), []);
    },
    _onReelsEnd: function (reelsIndex) {
        //check if initial animation is finished or not
        if (this.ready == false) {
            this._options.onReady();
        } else {
            this._options.onReelsEnd(reelsIndex);
        }
    }
};
export default Machine;