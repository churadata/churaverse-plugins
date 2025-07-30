import { IMainScene, Store } from 'churaverse-engine-client'
import { GameListItemRenderer } from '@churaverse/game-plugin-client/ui/gameList/gameListItemRenderer'
import { IGameDescriptionDialogManager } from '@churaverse/game-plugin-client/interface/IGameDescriptionDialogManager'
import { IGameSelectionListContainer } from '@churaverse/game-plugin-client/interface/IGameSelectionListContainer'

import SYNCHRO_BREAK_ICON_PATH from '../../assets/synchroBreakIcon.png'

export class SynchroBreakListItemRenderer extends GameListItemRenderer {
  public constructor(
    store: Store<IMainScene>,
    gameDialogManager: IGameDescriptionDialogManager,
    gameListContainer: IGameSelectionListContainer,
    imagePath: string = SYNCHRO_BREAK_ICON_PATH
  ) {
    super(store, gameDialogManager, {
      imagePath,
      gameId: 'synchroBreak',
      gameName: 'シンクロブレイク',
      order: 10,
    })
    gameListContainer.addGame(this)
  }
}
