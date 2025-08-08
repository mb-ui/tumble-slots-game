import explode from './explode';
function Score(scene) {
    this._scene = scene;
}
Score.prototype = {
    calculate: function () {
        debugger;
        this._scene.baseSpin.ready(); return;
        const con = this._scene.containers.getContainer(1, 1);
        explode(this._scene, con, {
            onDestroy: () => {
                this._scene.containers.tumbles([{ columnIndex: 1, order: 1 }])
            }
        });
    }
};
export default Score;