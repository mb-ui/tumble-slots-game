import globalOptions from '../../options';
import Config from '../../config';
import ScoreBoard from './scoreBoard';
export default ScoreBoard.bind(undefined, () => ({
    globalOptions,
    pub_sub,
    Config,
}))