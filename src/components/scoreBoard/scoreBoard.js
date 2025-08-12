function ScoreBoard(deps, scene) {
    const { Config, pub_sub } = deps();
    this._config = Config;
    this._scene = scene;
    pub_sub.on('onScore', (score) => { this._addScore(score); });
    pub_sub.on('onFail', () => {
        const finalScore = this._tempMony;
        this._deleteScore()._calculateScore(finalScore);
        finalScore && pub_sub.trigger('onPlus', undefined, () => [finalScore]);
    });
    pub_sub.on('onBet', () => { this._deleteScore(); });
    this._tempMony = 0;
}
ScoreBoard.prototype = {
    _deleteScore: function () {
        this._scene.txtWin && this._scene.txtWin.destroy();
        this._tempMony = 0;
        return this;
    },
    _addScore: function (score) {
        this._tempMony = this._tempMony + score;
        return this;
    },
    _calculateScore: function (finalScore) {
        if (!finalScore) {
            return;
        }
        this._tempMony = finalScore;
        const width = this._setTextWidthWin(finalScore);
        this._scene.txtWin = this._scene.add.text(width, this._config.height - 130, 'WIN: ' + finalScore + ' $ ', {
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