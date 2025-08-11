import globalOptions from '../../options';
import Config from '../../config';
import pub_sub from '../../api/pub_sub';
import CreditBoard from './creditBoard';
export default CreditBoard.bind(undefined, () => ({ globalOptions, pub_sub, Config }))