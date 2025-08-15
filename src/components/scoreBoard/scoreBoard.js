function ScoreBoard(deps, { scene }) {
    const { Config } = deps();
    this._config = Config;
    this._scene = scene;
    this._currentScore = 0;
}
ScoreBoard.prototype = {
    clear: function () {
        this._scene.txtWin && this._scene.txtWin.destroy();
        this._currentScore = 0;
        return this;
    },
    addScore: function (score) {
        this._currentScore = this._currentScore + score;
        this._scene.txtWin && this._scene.txtWin.destroy();
        const width = this._setTextWidthWin(this._currentScore);
        this._scene.txtWin = this._scene.add.text(width, this._config.height - 130, 'WIN: ' + this._currentScore + ' $ ', {
            fontSize: '20px',
            color: '#25a028',
            fontFamily: 'PT Serif'
        });
    },
    _setTextWidthWin: function (monyWin) {
        let width;
        if (monyWin >= 100000)
            width = this._config.width - 340;
        else if (monyWin >= 10000)
            width = this._config.width - 335;
        else if (monyWin >= 1000)
            width = this._config.width - 330;
        else if (monyWin >= 100)
            width = this._config.width - 322;
        else
            width = this._config.width - 340;
        return width;
    },
}
export default ScoreBoard;