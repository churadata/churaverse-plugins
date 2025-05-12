import { CoreGamePlugin } from '@churaverse/game-plugin-client/domain/coreGamePlugin'
import { CHURAREN_CONSTANTS } from './constants/churarenConstants'
import { SocketController } from './controller/socketController'
import { ChurarenDialogManager } from './ui/startWindow/churarenDialogManager'
import { RegisterGameUiEvent } from '@churaverse/game-plugin-client/event/registerGameUiEvent'
import { registerChurarenUi } from './ui/registerChurarenUi'
import { CHURAREN_UI_KEYS } from './ui/defChurarenUi'
import { BaseGamePlugin } from '@churaverse/game-plugin-client/domain/baseGamePlugin'
import { ChurarenResultEvent } from './event/churarenResultEvent'

export class ChurarenCorePlugin extends CoreGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  protected gameName = CHURAREN_CONSTANTS.GAME_NAME
  private churarenDialogManager?: ChurarenDialogManager
  private socketController?: SocketController

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('init', this.init.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )

    this.bus.subscribeEvent('registerGameUi', this.registerGameUi.bind(this))
  }

  /**
   * ゲームが開始された時に登録されるイベントリスナー
   */
  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('churarenStartCountdown', this.startCountdown)
    this.bus.subscribeEvent('churarenStartTimer', this.startTimer)
    this.bus.subscribeEvent('churarenResult', this.resultChurarenUi)
  }

  /**
   * ゲームが終了・中断された時に削除されるイベントリスナー
   */
  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('churarenStartCountdown', this.startCountdown)
    this.bus.unsubscribeEvent('churarenStartTimer', this.startTimer)
    this.bus.unsubscribeEvent('churarenResult', this.resultChurarenUi)
  }

  protected init(): void {
    this.churarenDialogManager = new ChurarenDialogManager(this.store, this.bus, this.gameId)
  }

  protected registerGameUi(ev: RegisterGameUiEvent): void {
    registerChurarenUi(this.store, this.gameId, ev.gameUiRegister)
  }

  /**
   * ゲームが開始された時の処理
   */
  protected handleGameStart(): void {
    this.socketController?.registerMessageListener()
    this.churarenDialogManager?.setGameAbortButtonText()
  }

  /**
   * 中断・終了時に実行される処理
   */
  protected handleGameTermination(): void {
    this.socketController?.unregisterMessageListener()
    this.churarenDialogManager?.setGameStartButtonText()
    this.gamePluginStore.gameUiManager.removeAllUis(this.gameId)
  }

  /**
   * 途中参加時の処理
   */
  protected handleMidwayParticipant(): void {
    this.socketController?.registerMessageListener()
    this.churarenDialogManager?.setGameAbortButtonText()
  }

  private readonly startCountdown = (): void => {
    this.gamePluginStore.gameUiManager.getUi(this.gameId, CHURAREN_UI_KEYS.DESCRIPTION_WINDOW)?.remove()
    const countdownWindow = this.gamePluginStore.gameUiManager.getUi(this.gameId, CHURAREN_UI_KEYS.COUNTDOWN_WINDOW)
    countdownWindow?.startCountdown()
  }

  private readonly startTimer = (): void => {
    this.gamePluginStore.gameUiManager.getUi(this.gameId, CHURAREN_UI_KEYS.COUNTDOWN_WINDOW)?.remove()
    const timerContainer = this.gamePluginStore.gameUiManager.getUi(this.gameId, CHURAREN_UI_KEYS.TIMER_CONTAINER)
    timerContainer?.startTimer()
  }

  private readonly resultChurarenUi = (ev: ChurarenResultEvent): void => {
    this.gamePluginStore.gameUiManager.getUi(this.gameId, CHURAREN_UI_KEYS.TIMER_CONTAINER)?.remove()
    const resultWindow = this.gamePluginStore.gameUiManager.getUi(this.gameId, CHURAREN_UI_KEYS.RESULT_WINDOW)
    resultWindow?.showResult(ev.resultType)
  }
}

declare module '@churaverse/game-plugin-client/interface/gameIds' {
  export interface GameIdsMap {
    churaren: BaseGamePlugin
  }
}
