import globalOptions from '../../options';
import Config from '../../config';
import Reels from './reels';
import SlotClass from '../slot/slot.factory.js';
export default Reels.bind(undefined, (scene) => ({
    globalOptions,
    Config,
    SlotClass
}))