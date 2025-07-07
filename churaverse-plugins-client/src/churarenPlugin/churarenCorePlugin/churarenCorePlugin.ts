import { CoreGamePlugin } from '@churaverse/game-plugin-client/domain/coreGamePlugin'
import { CHURAREN_CONSTANTS } from './constants/churarenConstants'
import { SocketController } from './controller/socketController'
import { ChurarenDialogManager } from './ui/startWindow/churarenDialogManager'
import { RegisterGameUiEvent } from '@churaverse/game-plugin-client/event/registerGameUiEvent'
import { registerChurarenUi } from './ui/registerChurarenUi'
import { CHURAREN_UI_KEYS } from './ui/defChurarenUi'
import { BaseGamePlugin } from '@churaverse/game-plugin-client/domain/baseGamePlugin'
import { ChurarenResultEvent } from './event/churarenResultEvent'
import { GamePlayerQuitEvent } from '@churaverse/game-plugin-client/event/gamePlayerQuitEvent'
import { isWeaponEntity } from './util/isWeaponEntity'
import { EntitySpawnEvent } from 'churaverse-engine-client'

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
    this.bus.subscribeEvent('entitySpawn', this.cancelChruaverseAction)
  }

  /**
   * ゲームが終了・中断された時に削除されるイベントリスナー
   */
  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('churarenStartCountdown', this.startCountdown)
    this.bus.unsubscribeEvent('churarenStartTimer', this.startTimer)
    this.bus.unsubscribeEvent('churarenResult', this.resultChurarenUi)
    this.bus.unsubscribeEvent('entitySpawn', this.cancelChruaverseAction)
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
  }

  /**
   * 途中参加時の処理
   */
  protected handleMidwayParticipant(): void {
    this.churarenDialogManager?.setGameAbortButtonText()
    this.unsubscribeGameEvent()
    // `gameAbort` や `gameEnd` イベントを受け取るために再度イベントを登録
    super.subscribeGameEvent()
  }

  protected handlePlayerLeave(playerId: string): void {
    this.bus.post(new GamePlayerQuitEvent(this.gameId, playerId))
  }

  protected handlePlayerQuitGame(playerId: string): void {}

  private readonly startCountdown = (): void => {
    this.gamePluginStore.gameUiManager.getUi(this.gameId, CHURAREN_UI_KEYS.DESCRIPTION_WINDOW)?.hideDescription()
    const countdownWindow = this.gamePluginStore.gameUiManager.getUi(this.gameId, CHURAREN_UI_KEYS.COUNTDOWN_WINDOW)
    countdownWindow?.startCountdown()
  }

  private readonly startTimer = (): void => {
    this.gamePluginStore.gameUiManager.getUi(this.gameId, CHURAREN_UI_KEYS.COUNTDOWN_WINDOW)?.hideCountdown()
    const timerContainer = this.gamePluginStore.gameUiManager.getUi(this.gameId, CHURAREN_UI_KEYS.TIMER_CONTAINER)
    timerContainer?.startTimer()
  }

  private readonly resultChurarenUi = (ev: ChurarenResultEvent): void => {
    this.gamePluginStore.gameUiManager.getUi(this.gameId, CHURAREN_UI_KEYS.TIMER_CONTAINER)?.hideTimer()
    const resultWindow = this.gamePluginStore.gameUiManager.getUi(this.gameId, CHURAREN_UI_KEYS.RESULT_WINDOW)
    resultWindow?.showResult(ev.resultType)
    resultWindow?.buttonElement.addEventListener('click', () => {
      this.bus.post(new GamePlayerQuitEvent(this.gameId, this.store.of('playerPlugin').ownPlayerId))
      resultWindow.remove()
    })
  }

  /**
   * ちゅられん参加者はちゅらバースの攻撃を撃てない
   */
  private readonly cancelChruaverseAction = (ev: EntitySpawnEvent): void => {
    if (!isWeaponEntity(ev.entity)) return
    if (this.participantIds.includes(ev.entity.ownerId)) {
      ev.cancel()
    }
  }
}

declare module '@churaverse/game-plugin-client/interface/gameIds' {
  export interface GameIdsMap {
    churaren: BaseGamePlugin
  }
}
