import globalOptions from '../../options';
import Slot from './slot.factory';
import Slots from './slots';
import pub_sub from '../../api/pub_sub';
/**
 * @param {any} scene
 */
const SlotsFactory = Slots.bind(undefined, () => ({ globalOptions, Slot, pub_sub }));
export default SlotsFactory;