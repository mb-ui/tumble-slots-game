import Options from '../options';
export default class Container extends Phaser.GameObjects.Container {
    constructor(scene, x, y, op = {}) {
        y = 95;
        super(scene, x, y);
        this._scene = scene;
        this.positionY = y;
        this.positionX = x;
        this.symbolHeight = Options.symbolHeight;
        this.height = 470;
        this.width = 140;
        this._fall = true;
        this.options = Object.assign({},
            {
                onEmpty: () => { },
                order: 0,
                columnIndex: 0,
                offsetY: 0,
                imgName: '',
                enableFallDetection: false,
                onFall: () => { },
            },
            op);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.world.enable(this);
        this._setCollideWorldBounds(true);
        this.body.setOffset(0, this.options.offsetY);
        this.setSize(this.width, this.height);
        this.body.setSize(this.width, this.height - this.options.offsetY);
        this.addSymbol(this.options.imgName);
    }
    _setCollideWorldBounds(value) {
        this._scene.physics.world.gravity.y = value ? 100000 : 5000;
        this.body.setBounce(value ? 0.5 : 0.15);
        this.body.setCollideWorldBounds(value);
    }
    addSymbol(existingImgName) {
        // const symbols1 = this._scene.add.spine(0, 0, "sixMealMan", "sixMealMan-atlas");
        // symbols1.setScale(0.2);
        // symbols1.animationState.setAnimation(0, "fall", true);
        // symbols1.skeleton.slots[22].color.set(0, 1, 0, 1);
        this.imgName = existingImgName || ('symbols_' + this.randomBetween(0, 9));
        const symbol = this._scene.add.sprite(0, - (this.options.order * Options.symbolHeight), 'symbols', this.imgName + '.png');
        this.add(symbol);
    }
    randomBetween(min, max) {
        return Phaser.Math.Between(min, max);
    }
    _onFall() {
        //this.first.animationState.setAnimation(0, "idle", true);
        this.options.onFall();
    }
    update() {
        if (this.body && this.list.length) {
            if (this.body.collideWorldBounds == false) {
                ///// remove symbol which is out of container
                const symbol = this.first;
                const childMatrix = symbol.getWorldTransformMatrix();
                const worldY = childMatrix.ty;
                if (worldY > (this.positionY + this.height + Options.symbolHeight)) {
                    this.remove(symbol, true);
                    this.options.onEmpty(this.options.columnIndex, this.options.order);
                }
            } else if (this.options.enableFallDetection && this.first && this._fall) {
                ///////// detect when the symbol has finished its fall ///////////
                const symbol = this.first;
                const childMatrix = symbol.getWorldTransformMatrix();
                const worldY = childMatrix.ty;
                if (
                    worldY >= this.positionY + this.height - ((this.options.order + 1) * Options.symbolHeight) &&
                    (this.first._lastWorldY == worldY)
                ) {
                    this._fall = false;
                    this._onFall();
                } else {
                    this.first._lastWorldY = worldY;
                }
            }
        }
    }
    empty() {
        //this.first.animationState.setAnimation(0, "fall", true);
        this._setCollideWorldBounds(false);
    }
    destroy() {
        const { columnIndex, order } = this.options;
        super.destroy();
        this._scene.containers.list[columnIndex][order] = null
    }
}