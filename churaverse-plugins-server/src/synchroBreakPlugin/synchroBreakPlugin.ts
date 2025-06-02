import { IMainScene } from 'churaverse-engine-server'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { CoreGamePlugin } from '@churaverse/game-plugin-server/domain/coreGamePlugin'
import { SynchroBreakPluginStore } from './store/defSynchroBreakPluginStore'
import { initSynchroBreakPluginStore, resetSynchroBreakPluginStore } from './store/synchroBreakPluginStoreManager'
import { SocketController } from './controller/socketController'
import { SynchroBreakTurnSelectEvent } from './event/synchroBreakTurnSelectEvent'
import { TimeLimitConfirmEvent } from './event/timeLimitConfirmEvent'
import { SendBetCoinEvent } from './event/sendBetCoinEvent'
import { NyokkiEvent } from './event/nyokkiEvent'
import { Nyokki } from './model/nyokki'
import { NyokkiActionResponseMessage } from './message/nyokkiActionResponseMessage'
import { SynchroBreakTurnEndEvent } from './event/synchroBreakTurnEndEvent'
import { SynchroBreakTurnEndMessage } from './message/synchroBreakTurnEndMessage'
import { UpdatePlayersCoinMessage } from './message/updatePlayersCoinMessage'
import { SendBetCoinResponseMessage } from './message/sendBetCoinResponseMessage'
import { SynchroBreakTurnStartEvent } from './event/synchroBreakTurnStartEvent'
import { SynchroBreakTurnStartMessage } from './message/synchroBreakTurnStartMessage'

export class SynchroBreakPlugin extends CoreGamePlugin {
  public readonly gameId = 'synchroBreak'

  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private synchroBreakPluginStore!: SynchroBreakPluginStore
  private socketController!: SocketController
  private sameTimePlayers: string[] = []
  private readonly nyokkiDurationTime = 100
  private readonly initialPlayerCoins = 100

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('init', this.init.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )
  }

  /**
   * ゲームが開始された時に登録されるイベントリスナー
   */
  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('synchroBreakTurnSelect', this.synchroBreakTurnSelect)
    this.bus.subscribeEvent('timeLimitConfirm', this.timeLimitConfirm)
    this.bus.subscribeEvent('sendBetCoin', this.sendBetCoin)
    this.bus.subscribeEvent('nyokki', this.nyokkiAction)
    this.bus.subscribeEvent('synchroBreakTurnEnd', this.synchroBreakTurnEnd)
    this.bus.subscribeEvent('synchroBreakTurnStart', this.synchroBreakTurnStart)
  }

  /**
   * ゲームが終了・中断された時に削除されるイベントリスナー
   */
  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('synchroBreakTurnSelect', this.synchroBreakTurnSelect)
    this.bus.unsubscribeEvent('timeLimitConfirm', this.timeLimitConfirm)
    this.bus.unsubscribeEvent('sendBetCoin', this.sendBetCoin)
    this.bus.unsubscribeEvent('nyokki', this.nyokkiAction)
    this.bus.unsubscribeEvent('synchroBreakTurnEnd', this.synchroBreakTurnEnd)
    this.bus.unsubscribeEvent('synchroBreakTurnStart', this.synchroBreakTurnStart)
  }

  private init(): void {
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  /**
   * シンクロブレイク特有の開始時に実行される処理
   */
  protected handleGameStart(): void {
    initSynchroBreakPluginStore(this.bus, this.store)
    this.socketController.registerMessageListener()
    this.synchroBreakPluginStore = this.store.of('synchroBreakPlugin')
    this.synchroBreakPluginStore.game.getSynchroBreakPluginStore(this.synchroBreakPluginStore)
    for (const playerId of this.participantIds) {
      this.synchroBreakPluginStore.playersCoinRepository.set(playerId, this.initialPlayerCoins)
    }

    const sortedPlayersCoin = this.synchroBreakPluginStore.playersCoinRepository.sortedPlayerCoins()
    this.networkPluginStore.messageSender.send(new UpdatePlayersCoinMessage({ playersCoin: sortedPlayersCoin }))
  }

  /**
   * シンクロブレイク特有の中断・終了時に実行される処理
   */
  protected handleGameTermination(): void {
    resetSynchroBreakPluginStore(this.store)
    this.socketController.unregisterMessageListener()
  }

  /**
   * ターンが設定された時の処理
   */
  private readonly synchroBreakTurnSelect = (ev: SynchroBreakTurnSelectEvent): void => {
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
  private readonly sendBetCoin = (ev: SendBetCoinEvent): void => {
    const playerId = ev.playerId
    const betCoins = ev.betCoins
    this.synchroBreakPluginStore.betCoinRepository.set(playerId, betCoins)

    const coins = this.synchroBreakPluginStore.playersCoinRepository.get(playerId)
    if (coins === undefined) throw new Error('coins is undefined')

    const currentCoins = coins - betCoins
    this.synchroBreakPluginStore.playersCoinRepository.set(playerId, currentCoins)
    this.networkPluginStore.messageSender.send(new SendBetCoinResponseMessage({ playerId, betCoins, currentCoins }))

    this.checkAndStartGameIfAllBet()
  }

  /**
   * 全プレイヤーがベットしているか確認し、全プレイヤーがベットしている場合にゲームを開始する
   */
  private checkAndStartGameIfAllBet(): void {
    const betCoinPlayerNumber = this.synchroBreakPluginStore.betCoinRepository.getBetCoinPlayerCount()
    const totalPlayerNum = this.participantIds.length
    if (betCoinPlayerNumber >= totalPlayerNum) {
      this.synchroBreakPluginStore.game.processTurnSequence().catch((error) => {
        console.error('ゲーム開始確認処理でエラーが発生しました:', error)
      })
    }
  }

  /**
   * プレイヤーがニョッキアクションを実行した際の処理
   */
  private readonly nyokkiAction = (ev: NyokkiEvent): void => {
    const playerId = ev.playerId
    const nyokki = new Nyokki(playerId, Date.now())
    this.synchroBreakPluginStore.nyokkiRepository.set(playerId, nyokki)

    const sameTimePlayerNum = this.sameTimePlayers.length
    if (sameTimePlayerNum === 0) {
      this.sameTimePlayers.push(playerId)

      setTimeout(() => {
        this.nyokkiActionResponse()
      }, this.nyokkiDurationTime)
    } else {
      this.sameTimePlayers.push(playerId)
    }
  }

  /**
   * ニョッキアクションの結果を返す
   */
  private nyokkiActionResponse(): void {
    const sameTimePlayersId = this.sameTimePlayers

    // isSuccessがtrueならば成功, falseならば失敗
    const isSuccess = this.sameTimePlayers.length === 1
    this.sameTimePlayers.forEach((playerId) => {
      this.synchroBreakPluginStore.nyokkiRepository.addNyokki(playerId, isSuccess)
    })

    const nyokkiLogText = this.synchroBreakPluginStore.nyokkiLogTextCreate.nyokkiLogTextCreate(
      sameTimePlayersId,
      isSuccess
    )

    const playerOrders = this.synchroBreakPluginStore.nyokkiRepository.playerOrders()

    const order = playerOrders.indexOf(this.sameTimePlayers[0]) + 1
    const nyokkiActionMessage = new NyokkiActionResponseMessage({
      sameTimePlayersId,
      isSuccess,
      nyokkiLogText,
      order,
    })
    this.networkPluginStore.messageSender.send(nyokkiActionMessage)
    this.sameTimePlayers = []
  }

  /**
   * ターンが開始した際の処理
   */
  private readonly synchroBreakTurnStart = (ev: SynchroBreakTurnStartEvent): void => {
    const sortedPlayersCoin = this.synchroBreakPluginStore.playersCoinRepository.sortedPlayerCoins()
    this.networkPluginStore.messageSender.send(new UpdatePlayersCoinMessage({ playersCoin: sortedPlayersCoin }))

    const turnNumber = ev.turnNumber
    const synchroBreakTurnStartMessage = new SynchroBreakTurnStartMessage({ turnNumber })
    this.networkPluginStore.messageSender.send(synchroBreakTurnStartMessage)
  }

  /**
   * ターンが終了した際の処理
   */
  private readonly synchroBreakTurnEnd = (ev: SynchroBreakTurnEndEvent): void => {
    const nyokkiRepository: string[] = this.synchroBreakPluginStore.nyokkiRepository.getAllPlayerId()

    // ニョッキしていないプレイヤーIdを取得
    const noNyokkiPlayerIds = this.participantIds.filter((playerId) => !nyokkiRepository.includes(playerId))
    const synchroBreakTurnSelect = this.synchroBreakPluginStore.turnSelect

    if (synchroBreakTurnSelect === undefined) throw new Error('synchroBreakTurnSelect is undefined')
    const synchroBreakTurnEndMessage = new SynchroBreakTurnEndMessage({
      noNyokkiPlayerIds,
    })
    this.networkPluginStore.messageSender.send(synchroBreakTurnEndMessage)

    this.calculateResultPlayersCoin()

    this.resetTurnRepository()
  }

  /**
   * ニョッキコレクションとベットコインレポジトリをリセットする
   */
  private resetTurnRepository(): void {
    this.synchroBreakPluginStore.nyokkiRepository.clear()
    this.synchroBreakPluginStore.betCoinRepository.clear()
  }

  /**
   * プレイヤーのコインを計算する
   */
  private calculateResultPlayersCoin(): void {
    this.participantIds.forEach((playerId) => {
      const calculatedCoins = this.calculateCoins(playerId)
      this.synchroBreakPluginStore.playersCoinRepository.set(playerId, calculatedCoins)
    })
  }

  /**
   * プレイヤーのアクションに対して、ベットコインと倍率のコイン数を計算する
   */
  private calculateCoins(playerId: string): number {
    const currentCoins = this.synchroBreakPluginStore.playersCoinRepository.get(playerId)
    if (currentCoins === undefined) throw new Error('currentCoins is undefined')

    const player: Nyokki | undefined = this.synchroBreakPluginStore.nyokkiRepository.get(playerId)
    if (player === undefined) return currentCoins

    const betCoins = this.synchroBreakPluginStore.betCoinRepository.get(playerId)
    const totalPlayerNum = this.participantIds.length
    const playerOrder: string[] = this.synchroBreakPluginStore.nyokkiRepository.playerOrders()
    if (betCoins === undefined) throw new Error('betCoins is undefined')
    const orderIndex = playerOrder.indexOf(playerId)

    // ニョッキに成功した場合はコインの増加量を計算し、失敗した場合は現在のコイン数をそのまま返す
    return orderIndex !== -1 ? currentCoins + betCoins * (totalPlayerNum - orderIndex) : currentCoins
  }
}

declare module '@churaverse/game-plugin-server/interface/gameIds' {
  export interface GameIdsMap {
    synchroBreak: SynchroBreakPlugin
  }
}
