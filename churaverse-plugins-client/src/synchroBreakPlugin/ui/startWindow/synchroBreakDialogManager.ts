import { IMainScene, IEventBus, Store, DomManager, domLayerSetting } from 'churaverse-engine-client'
import { CoreUiPluginStore } from '@churaverse/core-ui-plugin-client/store/defCoreUiPluginStore'
import { UpdateGameStateEvent } from '@churaverse/game-plugin-client/event/updateGameStateEvent'
import { ToGameState } from '@churaverse/game-plugin-client/type/toGameState'
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
  private readonly synchroBreakDialog: ISynchroBreakDialog
  private currentButtonState!: ToGameState
  public constructor(store: Store<IMainScene>, bus: IEventBus<IMainScene>) {
    this.synchroBreakDialog = new SynchroBreakDialog()
    this.synchroBreakDialog.addSection(new SynchroBreakSection('synchroBreak', 'ルール説明'))
    const explanation = DomManager.addJsxDom(RuleExplanationWindowComponent())
    domLayerSetting(explanation, 'highest')
    this.synchroBreakDialog.addContent('synchroBreak', explanation)
    this.coreUiPlugin = store.of('coreUiPlugin')
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
      const updateGameState = new UpdateGameStateEvent('synchroBreak', this.currentButtonState)
      bus.post(updateGameState)
      if (this.currentButtonState === 'start') this.setGameStartButtonText()
      else this.setGameAbortButtonText()
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
