import globalOptions from '../../options';
import Slot from './slot.factory';
import Slots from './slots';
import pub_sub from '../../api/pub_sub';
import Explode from './explode';
/**
 * @param {any} scene
 */
const SlotsFactory = Slots.bind(undefined, (scene) => ({ globalOptions, Slot, pub_sub, explod: new Explode(scene) }));
export default SlotsFactory;