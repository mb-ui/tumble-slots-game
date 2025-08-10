import Container from "./Container";
import Options from '../options';
let firstReel = true;
function Containers(scene) {
    this._diffTime = 50;
    this._scene = scene;
    this.list = [];
    this.createContainers();
}
Containers.prototype = {
    _createContainer: function (columnIndex, order, op) {
        const conX = Options.slotsX + (columnIndex * Options.slotWidth) + (columnIndex * Options.slotGapY);
        const conY = Options.slotsY - (order * Options.symbolHeight) - (order * Options.slotsGapX);
        const con = new Container(this._scene, Object.assign(
            {
                columnIndex,
                order,
                x: conX,
                y: conY,
                symbolX: Options.slotWidth / 2,
                symbolY: -10 * (order + 1),
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
        Array.from({ length: Options.slotFallCount }).map((value, i) => i).forEach((i) => this._createContainer(
            columnIndex,
            i,
            {
                enableFallDetection: i === 0,
                onFall: () => {
                    if (i === 0) {
                        if (columnIndex === Options.slotsCount - 1) {
                            this._onReady();
                        }
                    }
                }
            }
        ));
        setTimeout(() => {
            columnIndex++;
            columnIndex <= Options.slotsCount - 1 && this.createContainers(columnIndex);
        }, Options.slotsDelay)
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
        if (columnIndex === Options.slotsCount - 1 && order === Options.slotFallCount - 1) {
            this.list.forEach(cons => cons.forEach(con => con.destroy()));
            this.list = [];
            this.createContainers();
        }
    },
    empty: function () {
        this.list.forEach((cons, i) => setTimeout(() => { cons.forEach(con => con && con.empty()) }, i * 2 * Options.slotsDelay))
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
                        .filter(({ value, order }) => value && (order < Options.slotCapacity)),
                    columnIndex == arr[arr.length - 1].columnIndex
                );
            }
        });
    },
    _tumble: function (columnIndex, remainedCells, enableFallDetection) {
        let outsideCellOrder = 0;
        Array.from({ length: Options.slotCapacity }).map((value, i) => i).forEach((i) => {
            const remainCell = remainedCells[i];
            if (remainCell) {
                const con = this.list[columnIndex][remainCell.order];
                const existingImgName = con.imgName;

                const transition = remainCell.order - i;
                if (transition > 0) {
                    const oldOrder = transition;
                    con.destroy();
                    this._createContainer(columnIndex, i,
                        {
                            symbolY: Options.slotHeight - (oldOrder * Options.symbolHeight) - ((oldOrder - 1) * Options.slotsGapX),
                            imgName: existingImgName
                        }
                    );
                }
            } else {
                outsideCellOrder++;
                this._createContainer(columnIndex, i, {
                    symbolY: -10 * (outsideCellOrder + 1),
                    enableFallDetection: enableFallDetection && i === Options.slotCapacity - 1,
                    onFall: () => { setTimeout(() => { this._scene.score.calculate(true) }, 500) }
                });
            }
        });
    }
};
export default Containers;