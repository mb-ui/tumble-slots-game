import globalOptions from '../../options';
import Config from '../../config';
import Sprite from '../../adapters/Sprite';
import pub_sub from '../../api/pub_sub';
import PayTable from './payTable';
import dialogInfo from './dialogInfo';
const DialogInfo = dialogInfo.bind(undefined, () => ({ Sprite, globalOptions, Config }));
export default PayTable.bind(undefined, (scene) => ({
    globalOptions,
    pub_sub,
    Config,
    dialogInfo: new DialogInfo(scene)
}))