import globalOptions from '../../options';
import Config from '../../config';
import SpriteAdapter from '../../adapters/Sprite';
import Reels from './reels';
import SlotsClass from '../slots/slots.factory';
export default Reels.bind(undefined, (scene) => ({
    globalOptions,
    Config,
    SlotsClass
}))