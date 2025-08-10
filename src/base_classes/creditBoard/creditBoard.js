function CreditBoard(deps, scene) {
    const { pub_sub, globalOptions, Config } = deps();
    this._scene = scene;
    this._credit = globalOptions.credit;
    this.txtMoney = this._scene.add.text(Config.width - 1050, Config.height - 695, this._credit + '$', {
        fontSize: '30px',
        color: '#fff',
        fontFamily: 'PT Serif'
    });
    this._setTextX(this._credit);
    pub_sub.on('onBet', () => {
        this._credit = this._credit - globalOptions.bet;
        this.txtMoney.setText(this._credit + '$')
        this._setTextX(this._credit);
    });
    pub_sub.on('onPlus', (plusValue) => {
        this._credit = this._credit + plusValue;
        this.txtMoney.setText(this._credit + '$')
        this._setTextX(this._credit);
    });
}
CreditBoard.prototype = {
    _setTextX(value) {
        if (value >= 100000000) this.txtMoney.x = 217;
        else if (value >= 10000000) this.txtMoney.x = 220;
        else if (value >= 1000000) this.txtMoney.x = 230;
        else if (value >= 100000) this.txtMoney.x = 240;
        else if (value >= 10000) this.txtMoney.x = 240;
        else if (value >= 1000) this.txtMoney.x = 250;
        else if (value >= 100) this.txtMoney.x = 260;
        else if (value >= 10) this.txtMoney.x = 270;
        else this.txtMoney.x = 280;
    }
}
export default CreditBoard;