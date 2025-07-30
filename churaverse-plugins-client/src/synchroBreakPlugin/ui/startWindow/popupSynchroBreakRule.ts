import { IMainScene, Store } from 'churaverse-engine-client'
import { GameDescriptionWindow } from '@churaverse/game-plugin-client/ui/gameDetailWindow/gameDescriptionWindow'

export class PopupSynchroBreakRule extends GameDescriptionWindow {
  public constructor(store: Store<IMainScene>) {
    super(store, 'synchroBreak', 'シンクロブレイク')
  }
}
