import { IMainScene } from 'churaverse-engine-server'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { BaseGamePlugin } from '@churaverse/game-plugin-server/domain/baseGamePlugin'
import { SynchroBreakPluginStore } from './store/defSynchroBreakPluginStore'
import { initSynchroBreakPluginStore, resetSynchroBreakPluginStore } from './store/synchroBreakPluginStoreManager'
import { SocketController } from './controller/socketController'
import { NyokkiTurnSelectEvent } from './event/nyokkiTurnSelectEvent'
import { TimeLimitConfirmEvent } from './event/timeLimitConfirmEvent'
import { SendBetCoinEvent } from './event/sendBetCoinEvent'
import { NyokkiEvent } from './event/nyokkiEvent'
import { Nyokki, NyokkiStatus } from './model/nyokki'
import { NyokkiActionResponseMessage } from './message/nyokkiActionResponseMessage'
import { NyokkiGameTurnEnd } from './event/nyokkiGameTurnEnd'
import { NyokkiTurnEndMessage } from './message/nyokkiTurnEndMessage'
import { UpdatePlayersCoinMessage } from './message/updatePlayersCoinMessage'
import { SendBetCoinResponseMessage } from './message/sendBetCoinResponseMessage'
import { NyokkiGameTurnStartEvent } from './event/nyokkiGameTurnStartEvent'
import { NyokkiTurnStartMessage } from './message/nyokkiTurnStartMessage'

export class SynchroBreakPlugin extends BaseGamePlugin {
  protected readonly gameId = 'synchroBreak'

  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private synchroBreakPluginStore!: SynchroBreakPluginStore
  private socketController!: SocketController
  private sameTimePlayers: string[] = []
  private readonly nyokkiDurationTime = 100

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
    this.bus.subscribeEvent('nyokkiTurnSelect', this.nyokkiTurnSelect)
    this.bus.subscribeEvent('timeLimitConfirm', this.timeLimitConfirm)
    this.bus.subscribeEvent('sendBetCoin', this.sendBetCoin)
    this.bus.subscribeEvent('nyokki', this.nyokkiAction)
    this.bus.subscribeEvent('nyokkiGameTurnEnd', this.nyokkiGameTurnEnd)
    this.bus.subscribeEvent('nyokkiGameTurnStart', this.nyokkiGameTurnStart)
  }

  /**
   * ゲームが終了・中断された時に削除されるイベントリスナー
   */
  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('nyokkiTurnSelect', this.nyokkiTurnSelect)
    this.bus.unsubscribeEvent('timeLimitConfirm', this.timeLimitConfirm)
    this.bus.unsubscribeEvent('sendBetCoin', this.sendBetCoin)
    this.bus.unsubscribeEvent('nyokki', this.nyokkiAction)
    this.bus.unsubscribeEvent('nyokkiGameTurnEnd', this.nyokkiGameTurnEnd)
    this.bus.unsubscribeEvent('nyokkiGameTurnStart', this.nyokkiGameTurnStart)
  }

  private init(): void {
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  /**
   * シンクロブレイク特有の開始時に実行される処理
   */
  protected handleGameStart(): void {
    this.subscribeGameEvent()
    initSynchroBreakPluginStore(this.bus, this.store)
    this.socketController.registerMessageListener()
    this.synchroBreakPluginStore = this.store.of('synchroBreakPlugin')
    this.synchroBreakPluginStore.game.getSynchroBreakPluginStore(this.synchroBreakPluginStore)
    for (const playerId of this.participantIds) {
      this.synchroBreakPluginStore.playersCoinRepository.set(playerId, 100)
    }

    const sortedPlayersCoin = this.synchroBreakPluginStore.playersCoinRepository.sortedPlayerCoins()
    this.networkPluginStore.messageSender.send(new UpdatePlayersCoinMessage({ playersCoin: sortedPlayersCoin }))
  }

  /**
   * シンクロブレイク特有の中断・終了時に実行される処理
   */
  protected handleGameTermination(): void {
    this.unsubscribeGameEvent()
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
  private readonly sendBetCoin = (ev: SendBetCoinEvent): void => {
    const playerId = ev.playerId
    const betCoins = ev.betCoins
    this.synchroBreakPluginStore.betCoinRepository.set(playerId, betCoins)

    const coins = this.synchroBreakPluginStore.playersCoinRepository.get(playerId)
    if (coins === undefined) throw new Error('coins is undefined')

    const currentCoins = coins - betCoins
    this.synchroBreakPluginStore.playersCoinRepository.change(playerId, currentCoins)
    this.networkPluginStore.messageSender.send(new SendBetCoinResponseMessage({ playerId, betCoins, currentCoins }))

    this.checkAndStartGameIfAllBet().catch((error) => {
      console.error('ゲーム開始確認処理でエラーが発生しました:', error)
    })
  }

  /**
   * 全プレイヤーがベットしているか確認し、全プレイヤーがベットしている場合にゲームを開始する
   */
  private async checkAndStartGameIfAllBet(): Promise<void> {
    const betCoinPlayerNumber = this.synchroBreakPluginStore.betCoinRepository.getBetCoinPlayerCount()
    const totalPlayerNum = this.participantIds.length
    if (betCoinPlayerNumber >= totalPlayerNum) {
      this.synchroBreakPluginStore.game
        .processTurnSequence()
        .then(() => {
          console.log(
            '===== ===== ===== ===== ===== ===== ===== ===== ===== ===== finishSequence ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== '
          )
        })
        .catch(() => {})
    }
  }

  /**
   * プレイヤーがニョッキアクションを実行した際の処理
   */
  private readonly nyokkiAction = (ev: NyokkiEvent): void => {
    const playerId = ev.playerId
    const now = Date.now()
    const nyokki = new Nyokki(playerId, now)
    this.synchroBreakPluginStore.nyokkiCollection.set(playerId, nyokki)

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
    const sameTimePlayersSize = this.sameTimePlayers.length
    const sameTimePlayersId = this.sameTimePlayers

    // isSuccessがtrueならば成功, falseならば失敗
    const isSuccess = sameTimePlayersSize === 1
    this.sameTimePlayers.forEach((playerId) => {
      this.synchroBreakPluginStore.nyokkiCollection.makeNyokki(playerId, isSuccess)
    })

    const nyokkiLogText = this.synchroBreakPluginStore.nyokkiLogTextCreate.nyokkiLogTextCreate(
      sameTimePlayersId,
      isSuccess
    )

    const playerOrders = this.synchroBreakPluginStore.nyokkiCollection.playerOrders()

    console.log('playerOrders:', playerOrders) // 同時処理のプレイヤーのデバック用

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
  private readonly nyokkiGameTurnStart = (ev: NyokkiGameTurnStartEvent): void => {
    const sortedPlayersCoin = this.synchroBreakPluginStore.playersCoinRepository.sortedPlayerCoins()
    this.networkPluginStore.messageSender.send(new UpdatePlayersCoinMessage({ playersCoin: sortedPlayersCoin }))

    const turnNumber = ev.turnNumber
    const nyokkiGameTurnStartMessage = new NyokkiTurnStartMessage({ turnNumber })
    this.networkPluginStore.messageSender.send(nyokkiGameTurnStartMessage)
  }

  /**
   * ターンが終了した際の処理
   */
  private readonly nyokkiGameTurnEnd = (ev: NyokkiGameTurnEnd): void => {
    const nyokkiCollection: string[] = this.synchroBreakPluginStore.nyokkiCollection.getAllPlayerId()

    // ニョッキしていないプレイヤーIdを取得
    const noNyokkiPlayerIds = this.participantIds.filter((playerId) => !nyokkiCollection.includes(playerId))
    const nyokkiTurnSelect = this.synchroBreakPluginStore.turnSelect

    if (nyokkiTurnSelect === undefined) throw new Error('nyokkiTurnSelect is undefined')
    const nyokkiGameTurnEndMessage = new NyokkiTurnEndMessage({
      noNyokkiPlayerIds,
    })
    this.networkPluginStore.messageSender.send(nyokkiGameTurnEndMessage)

    this.calculateResultPlayersCoin()

    this.resetTurnCollection()
  }

  /**
   * ニョッキコレクションとベットコインレポジトリをリセットする
   */
  private resetTurnCollection(): void {
    this.synchroBreakPluginStore.nyokkiCollection.clear()
    this.synchroBreakPluginStore.betCoinRepository.clear()
  }

  /**
   * プレイヤーのコインを計算する
   */
  private calculateResultPlayersCoin(): void {
    this.participantIds.forEach((playerId) => {
      const calculatedCoins = this.calculateCoins(playerId)
      this.synchroBreakPluginStore.playersCoinRepository.change(playerId, calculatedCoins)
    })
  }

  /**
   * プレイヤーのアクションに対して、ベットコインと倍率のコイン数を計算する
   */
  private calculateCoins(playerId: string): number {
    const currentCoins = this.synchroBreakPluginStore.playersCoinRepository.get(playerId)
    if (currentCoins === undefined) throw new Error('currentCoins is undefined')

    const player: Nyokki | undefined = this.synchroBreakPluginStore.nyokkiCollection.get(playerId)
    if (player === undefined) return currentCoins

    const playerStatus: NyokkiStatus = player.getNyokkiStatus
    const betCoins = this.synchroBreakPluginStore.betCoinRepository.get(playerId)
    const totalPlayerNum = this.participantIds.length
    const playerOrder: string[] = this.synchroBreakPluginStore.nyokkiCollection.playerOrders()
    if (betCoins === undefined) throw new Error('betCoins is undefined')
    // playerStatusが'success'の場合にのみpayoutの増加分の値を返す。それ以外はpayoutを0とする
    const payout = this.synchroBreakPluginStore.betCoinRepository.calculateMultiplier(
      betCoins,
      totalPlayerNum,
      playerOrder.indexOf(playerId)
    )

    const gain = playerStatus === 'success' ? payout : 0
    const calculatedCoins = gain + currentCoins
    return calculatedCoins
  }
}

declare module '@churaverse/game-plugin-server/interface/gameIds' {
  export interface GameIdsMap {
    synchroBreak: SynchroBreakPlugin
  }
}
