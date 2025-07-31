import { IMainScene, IEventBus, Store, DomManager, domLayerSetting } from 'churaverse-engine-client'
import { CoreUiPluginStore } from '@churaverse/core-ui-plugin-client/store/defCoreUiPluginStore'
import { PlayerPluginStore } from '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import { NetworkPluginStore } from '@churaverse/network-plugin-client/store/defNetworkPluginStore'
import { RequestGameStartMessage } from '@churaverse/game-plugin-client/message/gameStartMessage'
import { RequestGameAbortMessage } from '@churaverse/game-plugin-client/message/gameAbortMessage'
import { GameState } from '@churaverse/game-plugin-client/type/gameState'
import { ChurarenIcon } from './churarenIcon'
import { GAME_START_BUTTON, RuleExplanationWindowComponent } from './component/RuleExplanationWindowComponent'
import { ChurarenDialog } from '../dialog/churarenDialog'
import { ChurarenSection } from '../dialog/churarenSection'
import { IChurarenDialog } from '../../interface/IChurarenDialog'
import { GameIds } from '@churaverse/game-plugin-client/interface/gameIds'

/**
 * 画面上部に並ぶアイコンにシンクロブレイクアイコンを追加するクラス
 */
export class ChurarenDialogManager {
  private readonly churarenIcon?: ChurarenIcon
  private readonly coreUiPlugin: CoreUiPluginStore
  private readonly playerPlugin: PlayerPluginStore
  private readonly networkPluginStore: NetworkPluginStore<IMainScene>
  private readonly churarenDialog: IChurarenDialog
  private readonly gameId: GameIds
  private currentButtonState!: GameState
  public constructor(store: Store<IMainScene>, bus: IEventBus<IMainScene>, gameId: GameIds) {
    this.gameId = gameId
    this.churarenDialog = new ChurarenDialog()
    this.churarenDialog.addSection(new ChurarenSection(this.gameId, 'ルール説明'))
    const explanation = DomManager.addJsxDom(RuleExplanationWindowComponent())
    domLayerSetting(explanation, 'highest')
    this.churarenDialog.addContent('churaren', explanation)
    this.coreUiPlugin = store.of('coreUiPlugin')
    this.playerPlugin = store.of('playerPlugin')
    this.networkPluginStore = store.of('networkPlugin')
    this.churarenIcon = new ChurarenIcon(
      this.coreUiPlugin.switcher,
      this.churarenDialog,
      this.coreUiPlugin.topBarIconContainer
    )
    this.currentButtonState = 'start'
    this.setupGameStartButton(bus)
  }

  /**
   * ゲーム操作ボタンを押した時の処理
   */
  private setupGameStartButton(bus: IEventBus<IMainScene>): void {
    const startButton = DomManager.getElementById(GAME_START_BUTTON)
    startButton.onclick = () => {
      this.churarenDialog.close()
      this.churarenIcon?.onClick(true)
      if (this.currentButtonState === 'start') {
        const gameStartMessage = new RequestGameStartMessage({
          gameId: this.gameId,
          playerId: this.playerPlugin.ownPlayerId,
        })
        this.networkPluginStore.messageSender.send(gameStartMessage)
        this.setGameStartButtonText()
      } else {
        const gameAbortMessage = new RequestGameAbortMessage({
          gameId: this.gameId,
          playerId: this.playerPlugin.ownPlayerId,
        })
        this.networkPluginStore.messageSender.send(gameAbortMessage)
        this.setGameAbortButtonText()
      }
    }
  }

  /**
   * ゲーム操作ボタンの表示をゲーム開始の文章に変更する
   */
  public setGameStartButtonText(): void {
    const button = DomManager.getElementById(GAME_START_BUTTON)
    button.textContent = 'ゲームを開始する'
    this.currentButtonState = 'start'
  }

  /**
   * ゲーム操作ボタンの表示をゲーム開始の文章に変更する
   */
  public setGameAbortButtonText(): void {
    const button = DomManager.getElementById(GAME_START_BUTTON)
    button.textContent = 'ゲームを中断する'
    this.currentButtonState = 'abort'
  }
}
