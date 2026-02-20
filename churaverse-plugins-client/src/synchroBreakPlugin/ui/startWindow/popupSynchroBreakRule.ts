import { IMainScene, Store } from 'churaverse-engine-client'
import { GameDescriptionDialog } from '@churaverse/game-plugin-client/ui/gameDescriptionDialog/gameDescriptionDialog'

export class PopupSynchroBreakRule extends GameDescriptionDialog {
  public constructor(store: Store<IMainScene>) {
    super(store, 'synchroBreak', 'シンクロブレイク')
  }
}
