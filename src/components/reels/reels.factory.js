import globalOptions from '../../options';
import Config from '../../config';
import SpriteAdapter from '../../adapters/Sprite';
import Reels from './reels';
import SlotClass from '../slot/slot.factory';
export default Reels.bind(undefined, (scene) => ({
    globalOptions,
    Config,
    SlotClass
}))