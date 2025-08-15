import Options from '../options';
export default class BetBoard {
    constructor({ scene }) {
        const txtWin = scene.add.text(50, 665, 'BET: ' + Options.bet, {
            fontSize: '20px',
            color: '#fff',
            fontFamily: 'PT Serif'
        });
        txtWin.alpha = 0.4;
    }
}