import { IMainScene, Store } from 'churaverse-engine-client'
import { IGameSelectionListContainer } from '@churaverse/game-plugin-client/interface/IGameSelectionListContainer'
import { GameSelectionListItemRenderer } from '@churaverse/game-plugin-client/ui/gameList/gameSelectionListItemRenderer'

import SYNCHRO_BREAK_ICON_PATH from '../../assets/synchroBreakIcon.png'
import { GamePolicy } from '@churaverse/game-plugin-client/interface/gamePolicy'

export class SynchroBreakListItemRenderer extends GameSelectionListItemRenderer {
  public constructor(
    store: Store<IMainScene>,
    gamePolicy: GamePolicy,
    gameListContainer: IGameSelectionListContainer,
    imagePath: string = SYNCHRO_BREAK_ICON_PATH
  ) {
    super(store, gamePolicy, {
      imagePath,
      gameId: 'synchroBreak',
      gameName: 'シンクロブレイク',
      order: 10,
    })
    gameListContainer.addGame(this)
  }
}
