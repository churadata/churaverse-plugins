import { IMainScene, Store } from 'churaverse-engine-client'
import { IGameSelectionListContainer } from '@churaverse/game-plugin-client/interface/IGameSelectionListContainer'
import { GameSelectionListItemRenderer } from '@churaverse/game-plugin-client/ui/gameList/gameSelectionListItemRenderer'
import { GamePolicy } from '@churaverse/game-plugin-client/interface/gamePolicy'
import { CHURAREN_CONSTANTS } from '../../constants/churarenConstants'
import CHURAREN_ICON_PATH from '../../assets/churarenIcon.png'
import { GamePolicy } from '@churaverse/game-plugin-client/interface/gamePolicy'

export class ChurarenListItemRenderer extends GameSelectionListItemRenderer {
  public constructor(
    store: Store<IMainScene>,
    gamePolicy: GamePolicy,
    gameListContainer: IGameSelectionListContainer,
    imagePath: string = CHURAREN_ICON_PATH
  ) {
    super(store, gamePolicy, {
      imagePath,
      gameId: CHURAREN_CONSTANTS.GAME_ID,
      gameName: CHURAREN_CONSTANTS.GAME_NAME,
      order: 20,
    })
    gameListContainer.addGame(this)
  }
}
