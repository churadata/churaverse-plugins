import { CoreGamePlugin } from '@churaverse/game-plugin-client/domain/coreGamePlugin'
import { CHURAREN_CONSTANTS } from './constants/churarenConstants'
import { SocketController } from './controller/socketController'
import { PlayerPluginStore } from '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import { ChurarenDialogManager } from './ui/startWindow/churarenDialogManager'
import { UpdateChurarenUiEvent } from './event/updateChurarenUiEvent'
import { RegisterGameUiEvent } from '@churaverse/game-plugin-client/event/registerGameUiEvent'
import { registerChurarenUi } from './ui/registerChurarenUi'
import { CHURAREN_UI_KEYS } from './ui/defChurarenUi'
import { ChurarenGameResult } from './types/uiTypes'
import { BaseGamePlugin } from '@churaverse/game-plugin-client/domain/baseGamePlugin'

export class ChurarenCorePlugin extends CoreGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  protected gameName = CHURAREN_CONSTANTS.GAME_NAME
  private playerPluginStore!: PlayerPluginStore
  private churarenDialogManager!: ChurarenDialogManager
  private socketController!: SocketController

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
    this.bus.subscribeEvent('updateChurarenUi', this.updateChurarenUi)
  }

  /**
   * ゲームが終了・中断された時に削除されるイベントリスナー
   */
  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('updateChurarenUi', this.updateChurarenUi)
  }

  protected init(): void {
    this.churarenDialogManager = new ChurarenDialogManager(this.store, this.bus, this.gameId)
    this.playerPluginStore = this.store.of('playerPlugin')
    this.gamePluginStore = this.store.of('gamePlugin')
  }

  protected registerGameUi(ev: RegisterGameUiEvent): void {
    registerChurarenUi(this.store, this.gameId, ev.gameUiRegister)
  }

  /**
   * ゲームが開始された時の処理
   */
  protected handleGameStart(): void {
    this.socketController.registerMessageListener()
    this.churarenDialogManager.setGameAbortButtonText()
  }

  /**
   * 中断・終了時に実行される処理
   */
  protected handleGameTermination(): void {
    this.socketController.unregisterMessageListener()
    this.churarenDialogManager.setGameStartButtonText()
  }

  /**
   * 途中参加時の処理
   */
  protected handleMidwayParticipant(): void {
    this.subscribeGameEvent()
    this.socketController.registerMessageListener()
    this.churarenDialogManager.setGameAbortButtonText()
  }

  private readonly updateChurarenUi = (ev: UpdateChurarenUiEvent): void => {
    switch (ev.uiType) {
      case 'startCount':
        this.updateCountdown()
        break
      case 'countTimer':
        this.updateTimer()
        break
      default:
        this.deleteTimerComponent()
        this.resultChurarenUi(ev.uiType)
        break
    }
  }

  private updateCountdown(): void {
    const countdownWindow = this.gamePluginStore.gameUiManager.getUi(this.gameId, CHURAREN_UI_KEYS.COUNTDOWN_WINDOW)
    countdownWindow?.startCountdown()
  }

  private updateTimer(): void {
    const timerContainer = this.gamePluginStore.gameUiManager.getUi(this.gameId, CHURAREN_UI_KEYS.TIMER_CONTAINER)
    timerContainer?.startTimer()
  }

  private resultChurarenUi(resultType: ChurarenGameResult): void {
    const resultWindow = this.gamePluginStore.gameUiManager.getUi(this.gameId, CHURAREN_UI_KEYS.RESULT_WINDOW)
    resultWindow?.showResult(resultType)
  }

  private deleteTimerComponent(): void {
    const timerContainer = this.gamePluginStore.gameUiManager.getUi(this.gameId, CHURAREN_UI_KEYS.TIMER_CONTAINER)
    timerContainer?.remove()
  }
}

declare module '@churaverse/game-plugin-client/interface/gameIds' {
  export interface GameIdsMap {
    churaren: BaseGamePlugin
  }
}
