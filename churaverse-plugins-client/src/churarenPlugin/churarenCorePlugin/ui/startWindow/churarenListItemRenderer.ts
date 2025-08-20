import { IMainScene, Store } from 'churaverse-engine-client'
import { IGameDescriptionDialogManager } from '@churaverse/game-plugin-client/interface/IGameDescriptionDialogManager'
import { IGameSelectionListContainer } from '@churaverse/game-plugin-client/interface/IGameSelectionListContainer'
import { GameSelectionListItemRenderer } from '@churaverse/game-plugin-client/ui/gameList/gameSelectionListItemRenderer'
import { CHURAREN_CONSTANTS } from '../../constants/churarenConstants'

import CHURAREN_ICON_PATH from '../../assets/churarenIcon.png'

export class SynchroBreakListItemRenderer extends GameSelectionListItemRenderer {
  public constructor(
    store: Store<IMainScene>,
    gameDialogManager: IGameDescriptionDialogManager,
    gameListContainer: IGameSelectionListContainer,
    imagePath: string = CHURAREN_ICON_PATH
  ) {
    super(store, gameDialogManager, {
      imagePath,
      gameId: CHURAREN_CONSTANTS.GAME_ID,
      gameName: CHURAREN_CONSTANTS.GAME_NAME,
      order: 20,
    })
    gameListContainer.addGame(this)
  }
}
