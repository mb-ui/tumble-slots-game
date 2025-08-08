import Config from '../config';
import Container from "./Container";
import Options from '../options';
function Containers(scene) {
    this._diffTime = 50;
    this._scene = scene;
    this.list = [];
    this._columnLength = 13;
    this._columnViewportLength = 3;
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
        con.setDepth(0);
        this.list[columnIndex] = this.list[columnIndex] || [];
        this.list[columnIndex][order] = con;
    },
    createContainers: function (columnIndex = 0) {
        Array.from({ length: 13 }).map((value, i) => i).forEach((i) => this._createContainer(
            columnIndex,
            i,
            {
                onFall: () => {
                    if (i === 0) {
                        columnIndex++;
                        columnIndex <= this._xColumns.length - 1 && this.createContainers(columnIndex);
                    }
                }
            }
        ));
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
    tumbles: function () {
        this.list.forEach((cons, columnIndex) => {
            const needTumble = cons.some((value) => value == null);
            if (needTumble) {
                this._tumble(columnIndex,
                    cons.map((value, i) => ({ value, order: i }))
                        .filter(({ value, order }) => value && (order < this._columnViewportLength))
                );
            }
        });
    },
    _tumble: function (columnIndex, remainedCells) {
        let outsideCellOrder = 0;
        Array.from({ length: this._columnViewportLength }).map((value, i) => i).forEach((i) => {
            const remainCell = remainedCells[i];
            if (remainCell) {
                if (remainCell.order !== i) {
                    const con = this.list[columnIndex][remainCell.order];
                    const existingImgName = con.imgName;
                    con.destroy();
                    const transition = remainCell.order - i;
                    this._createContainer(columnIndex, i,
                        {
                            offsetY: ((transition - (this._columnViewportLength - 1)) * Options.symbolHeight) + (Options.symbolHeight / 2),
                            imgName: existingImgName
                        }
                    );
                }
            } else {
                outsideCellOrder++;
                this._createContainer(columnIndex, i, { offsetY: outsideCellOrder * Options.symbolHeight });
            }
        });
    }
};
export default Containers;