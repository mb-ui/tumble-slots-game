import globalOptions from '../../options';
import Config from '../../config';
import pub_sub from '../../api/pub_sub';
import ScoreBoard from './scoreBoard';
export default ScoreBoard.bind(undefined, () => ({
    globalOptions,
    pub_sub,
    Config,
}))