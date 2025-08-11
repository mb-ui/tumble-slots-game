import pub_sub from '../../api/pub_sub';
import Config from '../../config';
import Audio from './Audio';
import Sprite from '../../adapters/Sprite';
import Options from '../../options';
export default Audio.bind(undefined, () => ({
    pub_sub,
    Config,
    Sprite,
    Options
}))