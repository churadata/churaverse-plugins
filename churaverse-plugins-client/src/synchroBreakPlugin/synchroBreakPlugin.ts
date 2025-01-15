import { BaseGamePlugin } from '@churaverse/game-plugin-client/domain/baseGamePlugin'
import { GamePluginStore } from '@churaverse/game-plugin-client/store/defGamePluginStore'
import { PriorGameDataEvent } from '@churaverse/game-plugin-client/event/priorGameDataEvent'
import { RegisterGameUiEvent } from '@churaverse/game-plugin-client/event/registerGameUiEvent'
import { GameStartEvent } from '@churaverse/game-plugin-client/event/gameStartEvent'
import { GameAbortEvent } from '@churaverse/game-plugin-client/event/gameAbortEvent'
import { GameEndEvent } from '@churaverse/game-plugin-client/event/gameEndEvent'
import { UpdateGameParticipantEvent } from '@churaverse/game-plugin-client/event/updateGameParticipantEvent'
import { SynchroBreakPluginStore } from './store/defSynchroBreakPluginStore'
import { SynchroBreakDialogManager } from './ui/startWindow/synchroBreakDialogManager'
import { initSynchroBreakPluginStore, resetSynchroBreakPluginStore } from './store/synchroBreakPluginStoreManager'
import { SocketController } from './controller/socketController'
import { TimeLimitConfirmEvent } from './event/timeLimitConfirmEvent'
import { registerSynchroBreakUi } from './ui/registerSynchroBreakUi'

export class SynchroBreakPlugin extends BaseGamePlugin {
  protected readonly gameId = 'synchroBreak'
  protected readonly gameName = 'シンクロブレイク'

  private synchroBreakPluginStore!: SynchroBreakPluginStore
  private gamePluginStore!: GamePluginStore
  private synchroBreakDialogManager!: SynchroBreakDialogManager
  private socketController!: SocketController

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )

    this.bus.subscribeEvent('registerGameUi', this.registerGameUi.bind(this))
    this.bus.subscribeEvent('gameStart', this.gameStartSynchroBreak.bind(this))
    this.bus.subscribeEvent('priorGameData', this.priorGameData.bind(this))
  }

  /**
   * ゲームが開始された時に登録されるイベントリスナー
   */
  private addListenEvent(): void {
    this.bus.subscribeEvent('gameAbort', this.gameAbortSynchroBreak)
    this.bus.subscribeEvent('gameEnd', this.gameEndSynchroBreak)
    this.bus.subscribeEvent('updateGameParticipant', this.gameParticipant)
    this.bus.subscribeEvent('timeLimitConfirm', this.timeLimitConfirm)
  }

  /**
   * ゲームが終了・中断された時に削除されるイベントリスナー
   */
  private deleteListenEvent(): void {
    this.bus.unsubscribeEvent('gameAbort', this.gameAbortSynchroBreak)
    this.bus.unsubscribeEvent('gameEnd', this.gameEndSynchroBreak)
    this.bus.unsubscribeEvent('updateGameParticipant', this.gameParticipant)
    this.bus.unsubscribeEvent('timeLimitConfirm', this.timeLimitConfirm)
  }

  private init(): void {
    this.synchroBreakDialogManager = new SynchroBreakDialogManager(this.store, this.bus)
    this.gamePluginStore = this.store.of('gamePlugin')
  }

  /**
   * ゲームUI登録のイベントを受け取った時の処理
   */
  private registerGameUi(ev: RegisterGameUiEvent): void {
    registerSynchroBreakUi(this.store, this.gameId, ev.gameUiRegister)
  }

  /**
   * ゲームが開始された時の処理
   */
  private gameStartSynchroBreak(ev: GameStartEvent): void {
    if (ev.gameId !== this.gameId || this.isActive) return
    this.gameStart(ev.playerId)
    this.addListenEvent()
    initSynchroBreakPluginStore(this.store)
    this.socketController.registerMessageListener()
    this.synchroBreakDialogManager.setGameAbortButtonText()
    this.synchroBreakPluginStore = this.store.of('synchroBreakPlugin')
  }

  /**
   * ゲームが中断された時の処理
   */
  private readonly gameAbortSynchroBreak = (ev: GameAbortEvent): void => {
    if (ev.gameId !== this.gameId) return
    this.gameAbort(ev.playerId)
    this.handleGameTermination()
  }

  /**
   * ゲームが終了した時の処理
   */
  private readonly gameEndSynchroBreak = (ev: GameEndEvent): void => {
    if (ev.gameId !== this.gameId) return
    this.gameEnd()
    this.handleGameTermination()
  }

  /**
   * ゲームの終了・中断時の共通処理
   */
  private handleGameTermination(): void {
    this.deleteListenEvent()
    this.socketController.unregisterMessageListener()
    this.synchroBreakDialogManager.setGameStartButtonText()
    resetSynchroBreakPluginStore(this.store)
  }

  /**
   * ゲーム参加者のidリストを受け取り、ゲーム参加者リストを更新する
   */
  private readonly gameParticipant = (ev: UpdateGameParticipantEvent): void => {
    if (ev.gameId !== this.gameId) return
    this.updateParticipantIds(ev.participantIds)
  }

  /**
   * プレイヤーが参加した際に、シンクロブレイクが開始されているかを確認する
   */
  private priorGameData(ev: PriorGameDataEvent): void {
    if (ev.runningGameId !== this.gameId || this.isActive) return
    this.addListenEvent()
    this.socketController.registerMessageListener()
    this.synchroBreakDialogManager.setGameAbortButtonText()
    this.processMidwayParticipant()
  }

  /**
   * タイムリミットが設定された際の処理
   */
  private readonly timeLimitConfirm = (ev: TimeLimitConfirmEvent): void => {
    if (this.isOwnPlayerMidwayParticipant) return
    this.synchroBreakPluginStore.timeLimit = Number(ev.timeLimit)
    const message = `タイムリミットが${ev.timeLimit}秒に設定されました。`
    this.gamePluginStore.gameLogRenderer.gameLog(message, 400)
    const descriptionWindow = this.gamePluginStore.gameUiManager.getUi(this.gameId, 'descriptionWindow')
    if (descriptionWindow !== undefined) {
      descriptionWindow.setDescriptionText(message)
    }
  }
}

declare module '@churaverse/game-plugin-client/interface/gameIds' {
  export interface GameIdsMap {
    synchroBreak: SynchroBreakPlugin
  }
}
