import { IMainScene, IEventBus, Store, DomManager, domLayerSetting } from 'churaverse-engine-client'
import { CoreUiPluginStore } from '@churaverse/core-ui-plugin-client/store/defCoreUiPluginStore'
import { PlayerPluginStore } from '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import { NetworkPluginStore } from '@churaverse/network-plugin-client/store/defNetworkPluginStore'
import { RequestGameStartMessage } from '@churaverse/game-plugin-client/message/gameStartMessage'
import { RequestGameAbortMessage } from '@churaverse/game-plugin-client/message/gameAbortMessage'
import { GameState } from '@churaverse/game-plugin-client/type/gameState'
import { SynchroBreakIcon } from './synchroBreakIcon'
import { SynchroBreakSection } from '../dialog/synchroBreakSection'
import { SynchroBreakDialog } from '../dialog/synchroBreakDialog'
import { ISynchroBreakDialog } from '../../interface/ISynchroBreakDialog'
import { RuleExplanationWindowComponent, GAME_START_BUTTON } from './component/RuleExplanationWindowComponent'

/**
 * 画面上部に並ぶアイコンにシンクロブレイクアイコンを追加するクラス
 */
export class SynchroBreakDialogManager {
  private readonly synchroBreakIcon?: SynchroBreakIcon
  private readonly coreUiPlugin: CoreUiPluginStore
  private readonly playerPlugin: PlayerPluginStore
  private readonly networkPluginStore: NetworkPluginStore<IMainScene>
  private readonly synchroBreakDialog: ISynchroBreakDialog
  private currentButtonState!: GameState
  public constructor(store: Store<IMainScene>, bus: IEventBus<IMainScene>) {
    this.synchroBreakDialog = new SynchroBreakDialog()
    this.synchroBreakDialog.addSection(new SynchroBreakSection('synchroBreak', 'ルール説明'))
    const explanation = DomManager.addJsxDom(RuleExplanationWindowComponent())
    domLayerSetting(explanation, 'highest')
    this.synchroBreakDialog.addContent('synchroBreak', explanation)
    this.coreUiPlugin = store.of('coreUiPlugin')
    this.playerPlugin = store.of('playerPlugin')
    this.networkPluginStore = store.of('networkPlugin')
    this.synchroBreakIcon = new SynchroBreakIcon(
      this.coreUiPlugin.switcher,
      this.synchroBreakDialog,
      this.coreUiPlugin.topBarIconContainer
    )
    this.currentButtonState = 'start'
    this.handleGameButtonClick(bus)
  }

  /**
   * ゲーム操作ボタンを押した時の処理
   */
  private handleGameButtonClick(bus: IEventBus<IMainScene>): void {
    const startButton = DomManager.getElementById(GAME_START_BUTTON)
    startButton.onclick = () => {
      this.synchroBreakDialog.close()
      this.synchroBreakIcon?.onClick(true)
      if (this.currentButtonState === 'start') {
        const gameStartMessage = new RequestGameStartMessage({
          gameId: 'synchroBreak',
          playerId: this.playerPlugin.ownPlayerId,
        })
        this.networkPluginStore.messageSender.send(gameStartMessage)
        this.setGameStartButtonText()
      } else {
        const gameAbortMessage = new RequestGameAbortMessage({
          gameId: 'synchroBreak',
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
