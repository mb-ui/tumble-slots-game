import explode from './explode';
import Options from '../options';
import Config from '../config';
function Score(scene) {
    this._scene = scene;
    this._minTumbleCount = 4;
    this._tempMony = 0;
}
Score.prototype = {
    calculate: function (isPreviouslyWin) {
        const cons = this._scene.containers;
        const symbols = {};
        //fill symbols
        cons.loop((con, i) => {
            const { order, columnIndex } = con.options;
            if (order < Options.slotCapacity) {
                const imgName = con.imgName;
                symbols[imgName] = symbols[imgName] || [];
                symbols[imgName].push({ columnIndex, order, imgName });
            }
        });
        //get symbols with more than 3 iteration
        const iteratedSymbols = Object.values(symbols).filter((value) => value.length >= this._minTumbleCount);
        const result = iteratedSymbols.reduce((ac, value) => ac.concat(value), []);
        this._saveMony(iteratedSymbols);
        result.length ? this.explode(result) : isPreviouslyWin ? this.win() : this.fail();
    },
    _saveMony: function (arr) {
        arr.forEach(item => {
            const symbolIndex = parseInt(item[0].imgName.split('_')[1]);
            const payArray = Options.payvalues[symbolIndex];
            const payArrayIndex = item.length > 4 ? 2 : 1;
            this._tempMony += payArray[payArrayIndex];
        })
    },
    _setTextWidthWin: function (monyWin) {
        let width;
        if (monyWin >= 100000)
            width = Config.width - 340;
        else if (monyWin >= 10000)
            width = Config.width - 335;
        else if (monyWin >= 1000)
            width = Config.width - 330;
        else if (monyWin >= 100)
            width = Config.width - 322;
        else
            width = Config.width - 340;
        return width;
    },
    win: function () {
        this._scene.baseSpin.ready();
        // set txtWin
        this._scene.txtWin && this._scene.txtWin.destroy();
        const width = this._setTextWidthWin(this._tempMony);
        this._scene.txtWin = this._scene.add.text(width, Config.height - 130, 'WIN: ' + this._tempMony + ' $ ', {
            fontSize: '20px',
            color: '#25a028',
            fontFamily: 'PT Serif'
        });
        // set valueMoney
        this._scene.valueMoney += (this._tempMony);
        this._scene.txtMoney.setText(this._scene.valueMoney + '$');
        this._tempMony = 0;
    },
    explode: function (arr) {
        for (let i = 0, length = arr.length, lastIndex = length - 1; i <= lastIndex; i++) {
            const { columnIndex, order } = arr[i];
            const con = this._scene.containers.getContainer(columnIndex, order);
            explode(this._scene, con, {
                onDestroy: () => {
                    i == lastIndex && this._scene.containers.tumbles(arr)
                }
            });
        }
    },
    fail: function () {
        this._scene.baseSpin.ready();
        this._scene.txtWin && this._scene.txtWin.destroy();
        this._tempMony = 0;
    },
};
export default Score;