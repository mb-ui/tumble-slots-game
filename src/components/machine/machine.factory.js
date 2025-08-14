import globalOptions from '../../options';
import Config from '../../config';
import SpriteAdapter from '../../adapters/Sprite';
import Machine from './machine';
import ReelsClass from '../reels/reels.factory';
export default Machine.bind(undefined, (scene) => ({
    globalOptions,
    Config,
    ReelsClass
}))