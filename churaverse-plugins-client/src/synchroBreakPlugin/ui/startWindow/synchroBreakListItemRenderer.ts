import { IMainScene, Store } from 'churaverse-engine-client'
import { IGameSelectionListContainer } from '@churaverse/game-plugin-client/interface/IGameSelectionListContainer'
import { GameSelectionListItemRenderer } from '@churaverse/game-plugin-client/ui/gameList/gameSelectionListItemRenderer'

import SYNCHRO_BREAK_ICON_PATH from '../../assets/synchroBreakIcon.png'

export class SynchroBreakListItemRenderer extends GameSelectionListItemRenderer {
  public constructor(
    store: Store<IMainScene>,
    gameListContainer: IGameSelectionListContainer,
    imagePath: string = SYNCHRO_BREAK_ICON_PATH
  ) {
    super(store, {
      imagePath,
      gameId: 'synchroBreak',
      gameName: 'シンクロブレイク',
      order: 10,
    })
    gameListContainer.addGame(this)
  }
}
