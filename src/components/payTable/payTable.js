function PayTable(deps, scene) {
    const { globalOptions, pub_sub, Config } = deps(scene);
    this._scene = scene;
    this._globalOptions = globalOptions;
    this._config = Config;
    this._pub_sub = pub_sub;
    pub_sub.one('onReady', () => {
        pub_sub.on('onCollide', ({ collision, slots, isLastCollide }) => {
            if (!isLastCollide) { return; }
            const { condidates, iteratedSymbols } = this.calculate(slots);
            debugger;
            const score = this._getScore(iteratedSymbols);
            score && pub_sub.trigger('onScore', this, () => [score]);
            if (condidates.length) {
                pub_sub.trigger('onWin', undefined, () => [condidates]);
            } else {
                pub_sub.trigger('onFail');
            }
        });
    });
}
PayTable.prototype = {
    calculate: function (slots) {
        const symbols = {};
        //fill symbols
        slots.loop((symbol, i) => {
            const { order, columnIndex } = symbol.options;
            if (order < this._globalOptions.slotCapacity) {
                const imgName = symbol.imgName;
                symbols[imgName] = symbols[imgName] || [];
                symbols[imgName].push({ columnIndex, order, imgName });
            }
        });
        //get symbols with more than 3 iteration
        const iteratedSymbols = Object.values(symbols).filter((value) => value.length >= this._globalOptions.minSymbolIterate);
        const result = iteratedSymbols.reduce((ac, value) => ac.concat(value), []);
        return { condidates: result, iteratedSymbols };
        // this._getScore(iteratedSymbols);
        // result.length ? this.this._Explod(result) : isPreviouslyWin ? this.win() : this.fail();
    },
    _getScore: function (arr) {
        let score = 0;
        arr.forEach(item => {
            const symbolIndex = parseInt(item[0].imgName.split('_')[1]);
            const payArray = this._globalOptions.payvalues[symbolIndex];
            const payArrayIndex = item.length > 4 ? 2 : 1;
            score += payArray[payArrayIndex];
        })
        return score;
    }
};
export default PayTable;