import { IMainScene } from 'churaverse-engine-server'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { BaseGamePlugin } from '@churaverse/game-plugin-server/domain/baseGamePlugin'
import { GameStartEvent } from '@churaverse/game-plugin-server/event/gameStartEvent'
import { SynchroBreakPluginStore } from './store/defSynchroBreakPluginStore'
import { initSynchroBreakPluginStore, resetSynchroBreakPluginStore } from './store/synchroBreakPluginStoreManager'
import { SocketController } from './controller/socketController'
import { NyokkiTurnSelectEvent } from './event/nyokkiTurnSelectEvent'
import { TimeLimitConfirmEvent } from './event/timeLimitConfirmEvent'
import { SendBetCoinEvent } from './event/sendBetCoinEvent'

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
  protected subscribeGameStartEvent(): void {
    super.subscribeGameStartEvent()
    this.bus.subscribeEvent('timeLimitConfirm', this.timeLimitConfirm)
    this.bus.subscribeEvent('sendBetCoin', this.sendBetCoin)
  }

  /**
   * ゲームが終了・中断された時に削除されるイベントリスナー
   */
  protected unsubscribeGameTerminationEvent(): void {
    super.unsubscribeGameTerminationEvent()
    this.bus.unsubscribeEvent('timeLimitConfirm', this.timeLimitConfirm)
    this.bus.unsubscribeEvent('sendBetCoin', this.sendBetCoin)
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
    initSynchroBreakPluginStore(this.bus, this.store)
    this.subscribeGameStartEvent()
    this.socketController.registerMessageListener()
    this.synchroBreakPluginStore = this.store.of('synchroBreakPlugin')
  }

  /**
   * シンクロブレイク特有の中断・終了時に実行される処理
   */
  protected handleGameTermination(): void {
    this.unsubscribeGameTerminationEvent()
    resetSynchroBreakPluginStore(this.store)
    this.socketController.unregisterMessageListener()
  }

  /**
   * ターンが設定された時の処理
   */
  private readonly nyokkiTurnSelect = (ev: NyokkiTurnSelectEvent): void => {
    this.synchroBreakPluginStore.turnSelect = ev.allTurn
  }

  /**
   * タイムリミットが設定された時の処理
   */
  private readonly timeLimitConfirm = (ev: TimeLimitConfirmEvent): void => {
    this.synchroBreakPluginStore.timeLimit = Number(ev.timeLimit)
  }

  /**
   * ベットコインが設定された時の処理
   */
  private readonly sendBetCoin = (ev: SendBetCoinEvent): void => {}
}

declare module '@churaverse/game-plugin-server/interface/gameIds' {
  export interface GameIdsMap {
    synchroBreak: SynchroBreakPlugin
  }
}
