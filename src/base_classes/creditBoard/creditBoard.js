function CreditBoard(deps, scene) {
    const { pub_sub, globalOptions, Config } = deps();
    let _credit = globalOptions.credit;
    this.txtMoney = scene.add.text(Config.width - 1050, Config.height - 695, _credit + '$', {
        fontSize: '30px',
        color: '#fff',
        fontFamily: 'PT Serif'
    });
    this._setTextX(_credit);
    pub_sub.on('onBet', () => {
        _credit = _credit - globalOptions.bet;
        this.txtMoney.setText(_credit + '$')
        this._setTextX(_credit);
    });
    pub_sub.on('onPlus', (plusValue) => {
        _credit = _credit + plusValue;
        this.txtMoney.setText(_credit + '$')
        this._setTextX(_credit);
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