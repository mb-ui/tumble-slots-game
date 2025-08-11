/**
 * 
 * @param {any} scene 
 * @param {()=>{globalOptions,Slot,pub_sub}} deps 
 */
function Slots(deps, scene) {
    const { Slot, pub_sub, globalOptions, explod } = deps(scene);
    this._globalOptions = globalOptions;
    this.Slot = Slot;
    this._explod = explod;
    this._scene = scene;
    this.list = [];
    this._isReady = false;
    this._createSlots();
    this._pub_sub = pub_sub;
    pub_sub.on('onSpin', () => { this.empty(); });
    const that = this;
    pub_sub.on('onWin', (candidates) => { that._explods(candidates); });
}
Slots.prototype = {
    _explods: function (condidates) {
        for (let i = 0, length = condidates.length, lastIndex = length - 1; i <= lastIndex; i++) {
            const { columnIndex, order } = condidates[i];
            const con = this.getContainer(columnIndex, order);
            this._explod.explod(con, () => {
                if (i == lastIndex) {
                    this._pub_sub.trigger('onExplod');
                    this.tumbles(condidates)
                }
            });
        }
    },
    _createSlot: function (columnIndex, order, op) {
        const conX = this._globalOptions.slotsX + (columnIndex * this._globalOptions.slotWidth) + (columnIndex * this._globalOptions.slotGapY);
        const conY = this._globalOptions.slotsY - (order * this._globalOptions.symbolHeight) - (order * this._globalOptions.slotsGapX);
        const con = new this.Slot(this._scene, Object.assign(
            {
                columnIndex,
                order,
                x: conX,
                y: conY,
                symbolX: this._globalOptions.slotWidth / 2,
                symbolY: -10 * (order + 1),
                onFall: (con) => this._onFall(con)
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
    _createSlots: function (columnIndex = 0) {
        Array.from({ length: this._globalOptions.slotFallCount }).map((value, i) => i).forEach((i) => this._createSlot(
            columnIndex,
            i,
            {
                enableFallDetection: i === 0,
                onCollide: () => {
                    if (i === 0 && columnIndex === this._globalOptions.slotsCount - 1) {
                        if (!this._isReady) {
                            this._isReady = true;
                            this._onReady();
                        } else {
                            this._onCollide({ columnIndex, order: i }, true);
                        }
                    } else {
                        this._onCollide({ columnIndex, order: i }, false);
                    }
                }
            }
        ));
        setTimeout(() => {
            columnIndex++;
            columnIndex <= this._globalOptions.slotsCount - 1 && this._createSlots(columnIndex);
        }, this._globalOptions.slotsDelay)
    },
    /** fired when last container has fall */
    _onReady: function () {
        this._pub_sub.trigger('onReady');
    },
    _onCollide: function (collision, isLastCollide) {
        this._pub_sub.trigger('onCollide', this, () => [{ collision, slots: this, isLastCollide }]);
    },
    _onFall: function (con) {
        const { columnIndex, order } = con.options;
        if (columnIndex === this._globalOptions.slotsCount - 1 && order === this._globalOptions.slotFallCount - 1) {
            this.list.forEach(cons => cons.forEach(con => con.destroy()));
            this.list = [];
            this._createSlots();
        }
    },
    empty: function () {
        this.list.forEach((cons, i) => setTimeout(() => { cons.forEach(con => con && con.empty()) }, i * 2 * this._globalOptions.slotsDelay))
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
                        .filter(({ value, order }) => value && (order < this._globalOptions.slotCapacity)),
                    columnIndex == this._globalOptions.slotsCount - 1
                );
            }
        });
    },
    _tumble: function (columnIndex, remainedCells, enableFallDetection) {
        let outsideCellOrder = 0;
        Array.from({ length: this._globalOptions.slotCapacity }).map((value, i) => i).forEach((i) => {
            const remainCell = remainedCells[i];
            if (remainCell) {
                const con = this.list[columnIndex][remainCell.order];
                const existingImgName = con.imgName;

                const transition = remainCell.order - i;
                if (transition > 0) {
                    const oldOrder = transition;
                    con.destroy();
                    this._createSlot(columnIndex, i,
                        {
                            symbolY: this._globalOptions.slotHeight - (oldOrder * this._globalOptions.symbolHeight) - ((oldOrder - 1) * this._globalOptions.slotsGapX),
                            imgName: existingImgName
                        }
                    );
                }
            } else {
                outsideCellOrder++;
                this._createSlot(columnIndex, i, {
                    symbolY: -10 * (outsideCellOrder + 1),
                    enableFallDetection: enableFallDetection && i === this._globalOptions.slotCapacity - 1,
                    onCollide: () => {
                        setTimeout(() => {
                            this._onCollide({ columnIndex, order: i }, i == this._globalOptions.slotCapacity - 1);
                        }, 500)
                    }
                });
            }
        });
    }
};
export default Slots;