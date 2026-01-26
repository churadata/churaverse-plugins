import { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import { GameDescriptionDialog } from '@churaverse/game-plugin-client/ui/gameDescriptionDialog/gameDescriptionDialog'

export class PopupSynchroBreakRule extends GameDescriptionDialog {
  public constructor(bus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(bus, store, 'synchroBreak', 'シンクロブレイク')
  }
}
