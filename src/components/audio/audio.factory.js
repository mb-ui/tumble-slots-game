import Config from '../../config';
import Audio from './Audio';
import Sprite from '../../adapters/Sprite';
import Options from '../../options';
export default Audio.bind(undefined, () => ({
    Config,
    Sprite,
    Options
}))