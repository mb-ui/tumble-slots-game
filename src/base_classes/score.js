import explode from './explode';
function Score(scene) {
    this._scene = scene;
    this._minTumbleCount = 4;
}
Score.prototype = {
    calculate: function () {
        const cons = this._scene.containers;
        const symbols = {};
        //fill symbols
        cons.loop((con, i) => {
            const { order, columnIndex } = con.options;
            if (order < cons.columnViewportLength) {
                symbols[con.imgName] = symbols[con.imgName] || [];
                symbols[con.imgName].push({ columnIndex, order });
            }
        });
        //get symbols with more than 3 iteration
        const result = Object.values(symbols).filter((value) => value.length >= this._minTumbleCount).reduce((ac, value) => ac.concat(value), []);
        result.length ? this.win(result) : this.fail();
    },
    win: function (arr) {
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
    fail: function () { this._scene.baseSpin.ready(); },
};
export default Score;