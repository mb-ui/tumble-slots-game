//Class Base Spin
export default class BaseSpin {
    constructor(deps, { scene, onClick }) {
        this.scene = scene;
        this._onClick = onClick;
        this._isPending = false;
        this._isPending || this._pending();
        const { globalOptions, SpriteAdapter, Config } = deps();
        this._globalOptions = globalOptions;
        this._SpinButton = new SpriteAdapter(this.scene, Config.width - 275, Config.height - 50, 'bgButtons', 'btn-spin.png');
        this._txtSpin = this.scene.add.dynamicBitmapText(Config.width - 315, Config.height - 70, 'txt_bitmap', this._globalOptions.txtSpin, 38);
        this._txtSpin.setDisplayCallback(this.scene.textCallback);
        this._SpinButton.on('pointerdown', (e) => { this._click(e); }, this);
        this._SpinButton.on('pointerup', () => this._SpinButton.setScale(1));
    }
    _click(e) {
        if (this._isPending) { return }
        this._SpinButton.setScale(0.9);
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