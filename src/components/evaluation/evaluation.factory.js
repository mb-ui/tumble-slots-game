import globalOptions from '../../options';
import Config from '../../config';
import Evaluation from './evaluation';
export default Evaluation.bind(undefined, () => ({
    globalOptions,
    Config,
}))