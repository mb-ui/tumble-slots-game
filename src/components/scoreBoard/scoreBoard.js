function ScoreBoard(deps, { scene }) {
    const { Config } = deps();
    this._config = Config;
    this._scene = scene;
    this._currentScore = 0;
}
ScoreBoard.prototype = {
    clear: function () {
        this._destroy();
        this._currentScore = 0;
        return this;
    },
    _destroy: function () { this.txtWin && this.txtWin.destroy(); },
    addScore: function (score) {
        this._currentScore = this._currentScore + score;
        this._destroy();
        this.txtWin = this._scene.add.text(50, 690, 'WIN: ' + this._currentScore + ' $ ', {
            fontSize: '20px',
            color: '#fff',
            fontFamily: 'PT Serif'
        });
        this.txtWin.alpha = 0.4;
    },
}
export default ScoreBoard;