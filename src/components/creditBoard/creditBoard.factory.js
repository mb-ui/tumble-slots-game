import globalOptions from '../../options';
import Config from '../../config';
import CreditBoard from './creditBoard';
export default CreditBoard.bind(undefined, () => ({ globalOptions, Config }))