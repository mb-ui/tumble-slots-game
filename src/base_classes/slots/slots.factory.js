import globalOptions from '../../options';
import Slot from './slot.factory';
import Slots from './slots';
/**
 * @param {any} scene
 */
const SlotsFactory = Slots.bind(undefined, { globalOptions, Slot });
export default SlotsFactory;