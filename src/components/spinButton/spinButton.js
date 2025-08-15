//Class Base Spin
export default class BaseSpin {
    constructor(deps, { scene, onClick }) {
        this.scene = scene;
        this._onClick = onClick;
        this._isPending = false;
        const { globalOptions, SpriteAdapter, Config } = deps();
        this._globalOptions = globalOptions;
        this._SpinButton = new SpriteAdapter(this.scene, Config.width - 175, Config.height - 60, 'spinButton');
        this._SpinButton.setScale(1.5)
        this._SpinButton.on('pointerdown', (e) => { this._click(e); }, this);
        this._SpinButton.on('pointerup', () => { });
    }
    _click(e) {
        if (this._isPending) { return }
        this._onClick(e);
        this._pending();
    }
    _pending() {
        this._isPending = true;
        this._SpinButton.setTint(0xa09d9d);
    }
    ready() {
        this._isPending = false;
        this._SpinButton.clearTint();
    }
}