function PayTable(deps, scene) {
    const { globalOptions, pub_sub, Config } = deps(scene);
    this._scene = scene;
    this._globalOptions = globalOptions;
    this._config = Config;
    this._pub_sub = pub_sub;
    //
    this._minTumbleCount = 4;
    this._tempMony = 0;
    //
    pub_sub.one('onReady', () => {
        pub_sub.on('onCollide', ({ collision, slots, isLastCollide }) => {
            if (!isLastCollide) { return; }
            const { condidates, iteratedSymbols } = this.calculate(slots);
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
        const iteratedSymbols = Object.values(symbols).filter((value) => value.length >= this._minTumbleCount);
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
    },
    // _setTextWidthWin: function (monyWin) {
    //     let width;
    //     if (monyWin >= 100000)
    //         width = this._config.width - 340;
    //     else if (monyWin >= 10000)
    //         width = this._config.width - 335;
    //     else if (monyWin >= 1000)
    //         width = this._config.width - 330;
    //     else if (monyWin >= 100)
    //         width = this._config.width - 322;
    //     else
    //         width = this._config.width - 340;
    //     return width;
    // },
    // win: function () {
    //     if (!this._tempMony) {
    //         return;
    //     }
    //     this._scene.baseSpin.ready();
    //     // set txtWin
    //     this._scene.txtWin && this._scene.txtWin.destroy();
    //     const width = this._setTextWidthWin(this._tempMony);
    //     this._scene.txtWin = this._scene.add.text(width, this._config.height - 130, 'WIN: ' + this._tempMony + ' $ ', {
    //         fontSize: '20px',
    //         color: '#25a028',
    //         fontFamily: 'PT Serif'
    //     });
    //     // set valueMoney
    //     this._scene.valueMoney += (this._tempMony);
    //     this._scene.txtMoney.setText(this._scene.valueMoney + '$');
    //     this._tempMony = 0;
    // },
    // this._Explod: function(arr) {
    //     for (let i = 0, length = arr.length, lastIndex = length - 1; i <= lastIndex; i++) {
    //         const { columnIndex, order } = arr[i];
    //         const con = this._scene.containers.getContainer(columnIndex, order);
    //         this._Explod(this._scene, con, {
    //             onDestroy: () => {
    //                 i == lastIndex && this._scene.containers.tumbles(arr)
    //             }
    //         });
    //     }
    // },
    // fail: function () {
    //     this._scene.baseSpin.ready();
    //     this._scene.txtWin && this._scene.txtWin.destroy();
    //     this._tempMony = 0;
    // },
};
export default PayTable;