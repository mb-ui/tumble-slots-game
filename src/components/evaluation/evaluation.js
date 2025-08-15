function Evaluation(deps, { scene, onSuccess, onFail }) {
    const { globalOptions, Config } = deps();
    this._scene = scene;
    this._globalOptions = globalOptions;
    this._config = Config;
    this._onSuccess = onSuccess;
    this._onFail = onFail;
}
Evaluation.prototype = {
    evaluate: function (slotsInfo) {
        const { condidates, iteratedSymbols } = this._calculate(slotsInfo);
        if (condidates.length) {
            this._onSuccess({ score: this._getScore(iteratedSymbols), winners: condidates });
        } else {
            this._onFail();
        }
    },
    /**
     * @param {Array<{slotIndex, reelsIndex, imgName }>} slotsInfo 
     */
    _calculate: function (slotsInfo) {
        const symbols = {};
        //fill symbols
        slotsInfo.forEach(({ slotIndex, reelsIndex, imgName }, i) => {
            if (slotIndex < this._globalOptions.reelsSlotsCount) {
                symbols[imgName] = symbols[imgName] || [];
                symbols[imgName].push({ reelsIndex, slotIndex, imgName });
            }
        });
        //get symbols with more than 3 iteration
        const iteratedSymbols = Object.values(symbols).filter((value) => value.length >= this._globalOptions.minSlotMatchForWin);
        const result = iteratedSymbols.reduce((ac, value) => ac.concat(value), []);
        return { condidates: result, iteratedSymbols };
    },
    _getScore: function (arr) {
        let score = 0;
        arr.forEach(item => {
            //const symbolIndex = parseInt(item[0].imgName.split('_')[1]);
            const payArray = this._globalOptions.payvalues[2];
            const payArrayIndex = item.length > 4 ? 2 : 1;
            score += payArray[payArrayIndex];
        })
        return score;
    }
};
export default Evaluation;