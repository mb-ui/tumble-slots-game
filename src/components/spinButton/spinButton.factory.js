import Config from '../../config';
import globalOptions from '../../options';
import SpriteAdapter from '../../adapters/Sprite';
import SpinButton from './spinButton';
export default SpinButton.bind(undefined, () => ({ globalOptions, SpriteAdapter, Config }))