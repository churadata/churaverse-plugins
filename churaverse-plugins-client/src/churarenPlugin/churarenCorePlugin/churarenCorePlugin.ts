import { BaseGamePlugin } from '@churaverse/game-plugin-client/domain/baseGamePlugin'
import { CHURAREN_CONSTANTS, ChurarenGameResult } from '@churaverse/churaren-engine-client'
import { initChurarenPluginStore, resetChurarenPluginStore } from './store/churarenPluginStoreManager'
import { SocketController } from './controller/socketController'
import { ChurarenPluginStore } from './store/defChurarenStore'
import { PlayerPluginStore } from '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import { ChurarenDialogManager } from './ui/startWindow/churarenDialogManager'
import { UpdateChurarenUiEvent } from './event/updateChurarenUiEvent'
import { GamePluginStore } from '@churaverse/game-plugin-client/store/defGamePluginStore'
import { RegisterGameUiEvent } from '@churaverse/game-plugin-client/event/registerGameUiEvent'
import { registerChurarenUi } from './ui/registerChurarenUi'
import { CHURAREN_UI_KEYS } from './ui/defChurarenUi'

export class ChurarenCorePlugin extends BaseGamePlugin {
  protected gameId = CHURAREN_CONSTANTS.GAME_ID
  protected gameName = CHURAREN_CONSTANTS.GAME_NAME
  private churarenPluginStore!: ChurarenPluginStore
  private playerPluginStore!: PlayerPluginStore
  private churarenDialogManager!: ChurarenDialogManager
  private socketController!: SocketController
  private gamePluginStore!: GamePluginStore

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
    this.subscribeGameEvent()
    initChurarenPluginStore(this.store)
    this.socketController.registerMessageListener()
    this.churarenDialogManager.setGameAbortButtonText()
    this.churarenPluginStore = this.store.of('churarenPlugin')
  }

  /**
   * 中断・終了時に実行される処理
   */
  protected handleGameTermination(): void {
    this.unsubscribeGameEvent()
    resetChurarenPluginStore(this.store)
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
}

declare module '@churaverse/game-plugin-client/interface/gameIds' {
  export interface GameIdsMap {
    churaren: ChurarenCorePlugin
  }
}
