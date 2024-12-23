import { IMainScene } from 'churaverse-engine-server'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { BaseGamePlugin } from '@churaverse/game-plugin-server/domain/baseGamePlugin'
import { PriorGameDataEvent } from '@churaverse/game-plugin-server/event/priorGameDataEvent'
import { PriorGameDataMessage } from '@churaverse/game-plugin-server/message/priorGameDataMessage'
import { GameStartEvent } from '@churaverse/game-plugin-server/event/gameStartEvent'
import { GameEndEvent } from '@churaverse/game-plugin-server/event/gameEndEvent'
import { GameAbortEvent } from '@churaverse/game-plugin-server/event/gameAbortEvent'
import { SynchroBreakPluginStore } from './store/defSynchroBreakPluginStore'
import { initSynchroBreakPluginStore, resetSynchroBreakPluginStore } from './store/synchroBreakPluginStoreManager'
import { SocketController } from './controller/socketController'
import { TimeLimitConfirmEvent } from './event/timeLimitConfirmEvent'

export class SynchroBreakPlugin extends BaseGamePlugin {
  protected readonly gameId = 'synchroBreak'

  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private synchroBreakPluginStore!: SynchroBreakPluginStore
  private socketController!: SocketController

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )
    this.bus.subscribeEvent('gameStart', this.gameStartSynchroBreak.bind(this))
  }

  /**
   * ゲームが開始された時に登録されるイベントリスナー
   */
  private addListenEvent(): void {
    this.bus.subscribeEvent('gameAbort', this.gameAbortSynchroBreak)
    this.bus.subscribeEvent('gameEnd', this.gameEndSynchroBreak)
    this.bus.subscribeEvent('priorGameData', this.priorGameData)
    this.bus.subscribeEvent('timeLimitConfirm', this.timeLimitConfirm)
  }

  /**
   * ゲームが終了・中断された時に削除されるイベントリスナー
   */
  private deleteListenEvent(): void {
    this.bus.unsubscribeEvent('gameAbort', this.gameAbortSynchroBreak)
    this.bus.unsubscribeEvent('gameEnd', this.gameEndSynchroBreak)
    this.bus.unsubscribeEvent('priorGameData', this.priorGameData)
    this.bus.unsubscribeEvent('timeLimitConfirm', this.timeLimitConfirm)
  }

  private init(): void {
    this.networkPluginStore = this.store.of('networkPlugin')
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
    resetSynchroBreakPluginStore(this.store)
    this.socketController.unregisterMessageListener()
  }

  /**
   * プレイヤーが途中参加した際の処理。シンクロブレイクゲームが開始されている場合、メッセージを送信する
   */
  private readonly priorGameData = (ev: PriorGameDataEvent): void => {
    if (!this.isActive) return
    this.networkPluginStore.messageSender.send(new PriorGameDataMessage({ runningGameId: this.gameId }))
  }

  /**
   * タイムリミットが設定された時の処理
   */
  private readonly timeLimitConfirm = (ev: TimeLimitConfirmEvent): void => {
    if (!this.isActive) return
    this.synchroBreakPluginStore.timeLimit = Number(ev.timeLimit)
  }
}

declare module '@churaverse/game-plugin-server/interface/gameIds' {
  export interface GameIdsMap {
    synchroBreak: SynchroBreakPlugin
  }
}
