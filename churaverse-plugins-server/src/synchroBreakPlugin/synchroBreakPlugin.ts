import { IMainScene, BasePlugin } from 'churaverse-engine-server'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import '@churaverse/game-plugin-server/interface/gameIds'
import { PriorGameDataEvent } from '@churaverse/game-plugin-server/event/priorGameDataEvent'
import { PriorGameDataMessage } from '@churaverse/game-plugin-server/message/priorGameDataMessage'
import { GameStartEvent } from '@churaverse/game-plugin-server/event/gameStartEvent'
import { GameEndEvent } from '@churaverse/game-plugin-server/event/gameEndEvent'
import { GameAbortEvent } from '@churaverse/game-plugin-server/event/gameAbortEvent'
import { SynchroBreakPluginStore } from './store/defSynchroBreakPluginStore'
import { initSynchroBreakPluginStore, resetSynchroBreakPluginStore } from './store/synchroBreakPluginStoreManager'
import { SocketController } from './controller/socketController'
import { TimeLimitConfirmMessage } from './message/timeLimitConfirmMessage'
import { TimeLimitConfirmEvent } from './event/timeLimitConfirmEvent'

export class SynchroBreakPlugin extends BasePlugin<IMainScene> {
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private synchroBreakPluginStore!: SynchroBreakPluginStore
  private socketController!: SocketController
  /** ゲームの状態を保存する変数 */
  private isActive: boolean = false

  /** イベントリスナーの登録・削除に使用する関数をbindしておく */
  private readonly boundGameAbort = this.gameAbort.bind(this)
  private readonly boundGameEnd = this.gameEnd.bind(this)
  private readonly boundPriorGameData = this.priorGameData.bind(this)
  private readonly boundTimeLimitConfirm = this.timeLimitConfirm.bind(this)

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )
    this.bus.subscribeEvent('gameStart', this.gameStart.bind(this))
  }

  /**
   * ゲームが開始された時に登録されるイベントリスナー
   */
  public addListenEvent(): void {
    this.bus.subscribeEvent('gameAbort', this.boundGameAbort)
    this.bus.subscribeEvent('gameEnd', this.boundGameEnd)
    this.bus.subscribeEvent('priorGameData', this.boundPriorGameData)
    this.bus.subscribeEvent('timeLimitConfirm', this.boundTimeLimitConfirm)
  }

  /**
   * ゲームが終了・中断された時に削除されるイベントリスナー
   */
  public deleteListenEvent(): void {
    this.bus.unsubscribeEvent('gameAbort', this.boundGameAbort)
    this.bus.unsubscribeEvent('gameEnd', this.boundGameEnd)
    this.bus.unsubscribeEvent('priorGameData', this.boundPriorGameData)
    this.bus.unsubscribeEvent('timeLimitConfirm', this.boundTimeLimitConfirm)
  }

  private init(): void {
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  /**
   * ゲームが開始された時の処理
   */
  private gameStart(ev: GameStartEvent): void {
    if (this.isActive) return
    this.isActive = true
    this.addListenEvent()
    initSynchroBreakPluginStore(this.store)
    this.socketController.registerMessageListener()
    this.synchroBreakPluginStore = this.store.of('synchroBreakPlugin')
  }

  /**
   * ゲームが中断された時の処理
   */
  private gameAbort(ev: GameAbortEvent): void {
    if (!this.isActive) return
    this.handleGameTermination()
  }

  /**
   * ゲームが終了した時の処理
   */
  private gameEnd(ev: GameEndEvent): void {
    if (!this.isActive) return
    this.handleGameTermination()
  }

  /**
   * ゲームの終了・中断時の共通処理
   */
  private handleGameTermination(): void {
    this.isActive = false
    this.deleteListenEvent()
    resetSynchroBreakPluginStore(this.store)
    this.socketController.unregisterMessageListener()
  }

  /**
   * プレイヤーが途中参加した際の処理。シンクロブレイクゲームが開始されている場合、メッセージを送信する
   */
  private priorGameData(ev: PriorGameDataEvent): void {
    if (this.isActive) {
      this.networkPluginStore.messageSender.send(new PriorGameDataMessage({ runningGameId: 'synchroBreak' }))
    }
  }

  /**
   * タイムリミットが設定された時の処理
   */
  private timeLimitConfirm(ev: TimeLimitConfirmEvent): void {
    if (!this.isActive) return
    this.synchroBreakPluginStore.timeLimit = Number(ev.timeLimit)
    this.networkPluginStore.messageSender.send(
      new TimeLimitConfirmMessage({ playerId: ev.playerId, timeLimit: ev.timeLimit })
    )
  }
}

declare module '@churaverse/game-plugin-server/interface/gameIds' {
  export interface GameIdsMap {
    synchroBreak: SynchroBreakPlugin
  }
}
