import globalOptions from '../../options';
import Slot from './slot';
/**
 * @param {any} scene
 * @param {any} options
 */
const SlotFactory = Slot.bind(undefined, { globalOptions });
export default SlotFactory;