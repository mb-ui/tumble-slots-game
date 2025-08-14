import globalOptions from '../../options';
import Config from '../../config.js';
import Slot from './slot';
import Explode from '../explode/explod.js';
import SpriteAdapter from '../../adapters/Sprite.js';
/**
 * @param {any} scene
 */
const SlotsFactory = Slot.bind(undefined, (scene) => ({
    globalOptions,
    Config,
    explod: new Explode(scene),
    SpriteAdapter
}));
export default SlotsFactory;