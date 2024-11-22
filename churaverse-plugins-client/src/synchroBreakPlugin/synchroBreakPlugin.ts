import { IMainScene, BasePlugin } from 'churaverse-engine-client'
import { GamePluginStore } from '@churaverse/game-plugin-client/store/defGamePluginStore'
import { PriorGameDataEvent } from '@churaverse/game-plugin-client/event/priorGameDataEvent'
import { RegisterGameUiEvent } from '@churaverse/game-plugin-client/event/registerGameUiEvent'
import { GameStartEvent } from '@churaverse/game-plugin-client/event/gameStartEvent'
import { GameAbortEvent } from '@churaverse/game-plugin-client/event/gameAbortEvent'
import { GameEndEvent } from '@churaverse/game-plugin-client/event/gameEndEvent'
import { GameIds } from '@churaverse/game-plugin-client/interface/gameIds'
import { SynchroBreakDialogManager } from './ui/startWindow/synchroBreakDialogManager'
import { DescriptionWindow } from './ui/descriptionWindow/descriptionWindow'
import { initSynchroBreakPluginStore, resetSynchroBreakPluginStore } from './store/synchroBreakPluginStoreManager'
import { TimeLimitFormContainer } from './ui/timeLimitFormContainer/timeLimitFormContainer'
import { SocketController } from './controller/socketController'
import { TimeLimitConfirmEvent } from './event/timeLimitConfirmEvent'

export class SynchroBreakPlugin extends BasePlugin<IMainScene> {
  private gamePluginStore!: GamePluginStore
  private synchroBreakDialogManager!: SynchroBreakDialogManager
  private socketController!: SocketController
  /** ゲームの状態を保存する変数 */
  private isActive: boolean = false
  /** 自プレイヤーが途中参加かどうかを示すフラグ */
  private isMidwayParticipate: boolean = false
  /** シンクロブレイクのゲームId */
  private readonly synchroBreakGameId: GameIds = 'synchroBreak'
  /** シンクロブレイクのゲーム名を保持する変数 */
  private readonly synchroBreakGameName: string = 'シンクロブレイク'

  /** イベントリスナーの登録・削除に使用する関数をbindしておく */
  private readonly boundGameAbort = this.gameAbort.bind(this)
  private readonly boundGameEnd = this.gameEnd.bind(this)
  private readonly boundTimeLimitConfirm = this.timeLimitConfirm.bind(this)

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )

    this.bus.subscribeEvent('registerGameUi', this.registerGameUi.bind(this))
    this.bus.subscribeEvent('gameStart', this.gameStart.bind(this))
    this.bus.subscribeEvent('priorGameData', this.priorGameData.bind(this))
  }

  /**
   * ゲームが開始された時に登録されるイベントリスナー
   */
  public addListenEvent(): void {
    this.bus.subscribeEvent('gameAbort', this.boundGameAbort)
    this.bus.subscribeEvent('gameEnd', this.boundGameEnd)
    this.bus.subscribeEvent('timeLimitConfirm', this.boundTimeLimitConfirm)
  }

  /**
   * ゲームが終了・中断された時に削除されるイベントリスナー
   */
  public deleteListenEvent(): void {
    this.bus.unsubscribeEvent('gameAbort', this.boundGameAbort)
    this.bus.unsubscribeEvent('gameEnd', this.boundGameEnd)
    this.bus.unsubscribeEvent('timeLimitConfirm', this.boundTimeLimitConfirm)
  }

  private init(): void {
    this.synchroBreakDialogManager = new SynchroBreakDialogManager(this.store, this.bus)
    this.gamePluginStore = this.store.of('gamePlugin')
  }

  /**
   * ゲームUIの登録を行う
   */
  private registerGameUi(ev: RegisterGameUiEvent): void {
    ev.gameUiRegister.registerGameUi(this.synchroBreakGameId, 'descriptionWindow', new DescriptionWindow())
    ev.gameUiRegister.registerGameUi(
      this.synchroBreakGameId,
      'timeLimitConfirm',
      new TimeLimitFormContainer(this.store)
    )
  }

  /**
   * ゲームが開始された時の処理
   */
  private gameStart(ev: GameStartEvent): void {
    if (ev.gameId === this.synchroBreakGameId) {
      this.isActive = true
      this.addListenEvent()
      initSynchroBreakPluginStore(this.store)
      this.socketController.registerMessageListener()
      this.synchroBreakDialogManager.setGameAbortButtonText()
      this.gamePluginStore.gameUiManager.initializeAllUis(ev.gameId)
      this.gamePluginStore.gameLogRenderer.gameStartLog(this.synchroBreakGameName, ev.playerId)
    }
  }

  /**
   * ゲームが中断された時の処理
   */
  private gameAbort(ev: GameAbortEvent): void {
    if (ev.gameId === this.synchroBreakGameId) {
      this.gamePluginStore.gameLogRenderer.gameAbortLog(this.synchroBreakGameName, ev.playerId)
      this.handleGameTermination(ev.gameId)
    }
  }

  /**
   * ゲームが終了した時の処理
   */
  private gameEnd(ev: GameEndEvent): void {
    if (ev.gameId === this.synchroBreakGameId) {
      this.gamePluginStore.gameLogRenderer.gameEndLog(this.synchroBreakGameName)
      this.handleGameTermination(ev.gameId)
    }
  }

  /**
   * ゲームの終了・中断時の共通処理
   */
  private handleGameTermination(gameId: GameIds): void {
    this.isActive = false
    this.deleteListenEvent()
    this.socketController.unregisterMessageListener()
    this.synchroBreakDialogManager.setGameStartButtonText()
    resetSynchroBreakPluginStore(this.store)
    if (!this.isMidwayParticipate) {
      this.gamePluginStore.gameUiManager.removeAllUis(gameId)
    } else {
      this.isMidwayParticipate = false
    }
  }

  /**
   * プレイヤーが参加した際に、シンクロブレイクが開始されているかを確認する
   */
  private priorGameData(ev: PriorGameDataEvent): void {
    if (ev.runningGameId === this.synchroBreakGameId && !this.isActive) {
      this.isMidwayParticipate = true
      this.isActive = true
      this.addListenEvent()
      this.socketController.registerMessageListener()
      this.synchroBreakDialogManager.setGameAbortButtonText()
      this.gamePluginStore.gameLogRenderer.gameLog(`${this.synchroBreakGameName}が開始されています。`, 400)
    }
  }

  /**
   * タイムリミットが設定された際の処理
   */
  private timeLimitConfirm(ev: TimeLimitConfirmEvent): void {
    if (this.isMidwayParticipate) return
    this.store.of('synchroBreakPlugin').timeLimit = Number(ev.timeLimit)
    const message = `タイムリミットが${ev.timeLimit}秒に設定されました。`
    this.gamePluginStore.gameLogRenderer.gameLog(message, 400)
    const descriptionWindow = this.gamePluginStore.gameUiManager.getUi(this.synchroBreakGameId, 'descriptionWindow')
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
