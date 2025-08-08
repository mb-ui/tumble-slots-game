import Config from '../config';
import Container from "./Container";
import Options from '../options';
let firstReel = true;
function Containers(scene) {
    this._diffTime = 50;
    this._scene = scene;
    this.list = [];
    this._columnLength = 13;
    this.columnViewportLength = 3;
    this._xColumns = [{ x: 940, y: 90 }, { y: 90, x: 790 }, { y: 90, x: 640 }, { y: 90, x: 490 }, { y: 90, x: 340 }];
    this.createContainers();
}
Containers.prototype = {
    _createContainer: function (columnIndex, order, op) {
        const { x, y } = this._xColumns[columnIndex];
        const con = new Container(this._scene, Config.width - x, Config.height - y, Object.assign(
            {
                columnIndex,
                order,
                offsetY: (order + 1) * Options.symbolHeight,
                onEmpty: (columnIndex, order) => this._onEmpty(columnIndex, order)
            },
            op
        ));
        con.setDepth(-1);
        this.list[columnIndex] = this.list[columnIndex] || [];
        this.list[columnIndex][order] = con;
    },
    loop: function (callback) {
        this.list.forEach(con => con.forEach((value, i) => callback(value, i)));
    },
    createContainers: function (columnIndex = 0) {
        Array.from({ length: 13 }).map((value, i) => i).forEach((i) => this._createContainer(
            columnIndex,
            i,
            {
                enableFallDetection: i === 0,
                onFall: () => {
                    if (i === 0) {
                        if (columnIndex === this._xColumns.length - 1) {
                            this._onReady();
                        }
                        columnIndex++;
                        columnIndex <= this._xColumns.length - 1 && this.createContainers(columnIndex);
                    }
                }
            }
        ));
    },
    /** fired when last container has fall */
    _onReady: function () {
        if (firstReel == false) {
            this._scene.score.calculate();
        } else {
            this._scene.baseSpin.ready();
        }
        firstReel = false;
    },
    _onEmpty: function (columnIndex, order) {
        if (columnIndex === 4 && order === this._columnLength - 1) {
            this.list.forEach(cons => cons.forEach(con => con.destroy()));
            this.list = [];
            this.createContainers();
        }
    },
    empty: function () {
        this.list.forEach((cons, i) => setTimeout(() => { cons.forEach(con => con && con.empty()) }, i * this._diffTime))
    },
    update: function () {
        this.list.forEach(cons => cons.forEach(con => con && con.update()));
    },
    getContainer: function (columnIndex, order) { return this.list[columnIndex][order]; },
    tumbles: function (arr) {
        this.list.forEach((cons, columnIndex) => {
            const needTumble = cons.some((value) => value == null);
            if (needTumble) {
                this._tumble(
                    columnIndex,
                    cons.map((value, i) => ({ value, order: i }))
                        .filter(({ value, order }) => value && (order < this.columnViewportLength)),
                    columnIndex == arr[arr.length - 1].columnIndex
                );
            }
        });
    },
    _tumble: function (columnIndex, remainedCells, enableFallDetection) {
        let outsideCellOrder = 0;
        Array.from({ length: this.columnViewportLength }).map((value, i) => i).forEach((i) => {
            const remainCell = remainedCells[i];
            if (remainCell) {
                if (remainCell.order !== i) {
                    const con = this.list[columnIndex][remainCell.order];
                    const existingImgName = con.imgName;
                    con.destroy();
                    const transition = remainCell.order - i;
                    this._createContainer(columnIndex, i,
                        {
                            offsetY: ((transition - (this.columnViewportLength - 1)) * Options.symbolHeight) + (Options.symbolHeight / 2),
                            imgName: existingImgName
                        }
                    );
                }
            } else {
                outsideCellOrder++;
                this._createContainer(columnIndex, i, {
                    offsetY: outsideCellOrder * Options.symbolHeight,
                    enableFallDetection: enableFallDetection && i === this.columnViewportLength - 1,
                    onFall: () => { this._scene.score.calculate(true) }
                });
            }
        });
    }
};
export default Containers;