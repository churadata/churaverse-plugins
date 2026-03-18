import { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import { GameDescriptionDialog } from '@churaverse/game-plugin-client/ui/gameDescriptionDialog/gameDescriptionDialog'
import { CHURAREN_CONSTANTS } from '../../constants/churarenConstants'

export class ChurarenDescriptionDialog extends GameDescriptionDialog {
  public constructor(bus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(bus, store, CHURAREN_CONSTANTS.GAME_ID, CHURAREN_CONSTANTS.GAME_NAME)
  }
}
