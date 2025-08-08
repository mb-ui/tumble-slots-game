import Config from '../config';
import Options from '../options';
import Sprite from './Sprite';
//Class Maxbet
export default class Maxbet {
    constructor(scene) {
        this.scene = scene;
        this.maxBet = new Sprite(this.scene, Config.width - 477, Config.height - 50, 'bgButtons', 'btn-maxbet.png');
        this.txtMaxBet = this.scene.add.dynamicBitmapText(Config.width - 550, Config.height - 70, 'txt_bitmap', Options.txtMaxBet, 38);
        this.txtMaxBet.setDisplayCallback(this.scene.textCallback);
        this.txtCountMaxBet = this.scene.add.text(Config.width - 555, Config.height - 140, 'BET: ' + Options.bet, {
            fontSize: '35px',
            color: '#fff',
            fontFamily: 'PT Serif'
        });
    }
}