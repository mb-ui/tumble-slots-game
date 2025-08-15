function CreditBoard(deps, { scene }) {
    const { globalOptions, Config } = deps();
    this._globalOptions = globalOptions;
    this._credit = globalOptions.credit;
    this.txtMoney = scene.add.text(50, 640, this._getTextFormat(), {
        fontSize: '20px',
        color: '#fff',
        fontFamily: 'PT Serif'
    });
    this.txtMoney.alpha = 0.4;
}
CreditBoard.prototype = {
    bet: function () {
        this._credit = this._credit - this._globalOptions.bet;
        this._setText();
    },
    win: function (plusValue) {
        this._credit = this._credit + plusValue;
        this._setText();
    },
    _getTextFormat: function () {
        return 'CREDIT: ' + this._credit + '$';
    },
    _setText: function () {
        this.txtMoney.setText(this._getTextFormat())
    }
}
export default CreditBoard;