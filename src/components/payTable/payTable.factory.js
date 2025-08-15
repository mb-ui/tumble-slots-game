import globalOptions from '../../options';
import Config from '../../config';
import Sprite from '../../adapters/Sprite';
import PayTable from './payTable';
import dialogInfo from './dialogInfo';
const DialogInfo = dialogInfo.bind(undefined, () => ({ Sprite, globalOptions, Config }));
export default PayTable.bind(undefined, (scene) => ({
    globalOptions,
    Config,
    dialogInfo: new DialogInfo(scene)
}))