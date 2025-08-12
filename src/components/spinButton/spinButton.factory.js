import Config from '../../config';
import globalOptions from '../../options';
import pub_sub from '../../api/pub_sub';
import Sprite from '../../adapters/Sprite';
import SpinButton from './spinButton';
export default SpinButton.bind(undefined, () => ({ globalOptions, Sprite, Config, pub_sub }))