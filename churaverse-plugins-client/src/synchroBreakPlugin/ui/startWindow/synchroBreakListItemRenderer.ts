import { IMainScene, Store } from 'churaverse-engine-client'
import { IGameDescriptionDialogManager } from '@churaverse/game-plugin-client/interface/IGameDescriptionDialogManager'
import { IGameSelectionListContainer } from '@churaverse/game-plugin-client/interface/IGameSelectionListContainer'
import { GameSelectionListItemRenderer } from '@churaverse/game-plugin-client/ui/gameList/gameSelectionListItemRenderer'
import { RequestGameAbortMessage } from '@churaverse/game-plugin-client/message/gameAbortMessage'

import SYNCHRO_BREAK_ICON_PATH from '../../assets/synchroBreakIcon.png'

export class SynchroBreakListItemRenderer extends GameSelectionListItemRenderer {
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

  protected override sendGameAbortMessage(): void {
    // SynchroBreak 固有の確認メッセージ（store 初期化済前提）
    const gamePluginStore = this.store.of('gamePlugin')
    const synchro = this.store.of('synchroBreakPlugin') as { exitConfirmMessage?: string }
    const message = synchro.exitConfirmMessage
    const ok = gamePluginStore.gameExitAlertConfirmManager.showAlert('synchroBreak', message)
    if (!ok) return

    // 親の送信ロジック相当（重複実装：基底は private → override 部分で再実装）
    const abortMsg = new RequestGameAbortMessage({
      gameId: 'synchroBreak',
      playerId: this.store.of('playerPlugin').ownPlayerId,
    })
    this.store.of('networkPlugin').messageSender.send(abortMsg)
  }
}
