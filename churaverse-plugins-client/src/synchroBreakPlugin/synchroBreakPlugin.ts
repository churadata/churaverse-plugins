import { PhaserLoadAssets, PhaserSceneInit } from 'churaverse-engine-client'
import { Scene } from 'phaser'
import { CoreGamePlugin } from '@churaverse/game-plugin-client/domain/coreGamePlugin'
import { RegisterGameUiEvent } from '@churaverse/game-plugin-client/event/registerGameUiEvent'
import { PlayerPluginStore } from '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import { SynchroBreakPluginStore } from './store/defSynchroBreakPluginStore'
import { SynchroBreakDialogManager } from './ui/startWindow/synchroBreakDialogManager'
import { initSynchroBreakPluginStore, resetSynchroBreakPluginStore } from './store/synchroBreakPluginStoreManager'
import { SocketController } from './controller/socketController'
import { NyokkiTurnSelectEvent } from './event/nyokkiTurnSelectEvent'
import { TimeLimitConfirmEvent } from './event/timeLimitConfirmEvent'
import { SendBetCoinResponseEvent } from './event/sendBetCoinResponseEvent'
import { registerSynchroBreakUi } from './ui/registerSynchroBreakUi'
import { IDescriptionText } from './interface/IDescriptionText'
import { PlayerNyokkiStatusIcon } from './ui/synchroBreakIcon/playerNyokkiStatusIcon'
import { CoinViewer } from './ui/coinViewer/coinViewer'
import { CoinViewerIcon } from './ui/coinViewer/coinViewerIcon'
import { NyokkiGameStartCountEvent } from './event/nyokkiGameStartCountEvent'
import { NyokkiTurnTimerEvent } from './event/nyokkiTurnTimerEvent'
import { NyokkiActionResponseEvent } from './event/nyokkiActionResponseEvent'
import { NyokkiTurnEndEvent } from './event/nyokkiTurnEndEvent'
import { NyokkiTurnStartEvent } from './event/nyokkiTurnStartEvent'
import { UpdatePlayersCoinEvent } from './event/updatePlayersCoinEvent'
import { NyokkiStatus } from './type/nyokkiStatus'
import { IRankingBoard } from './interface/IRankingBoard'

export class SynchroBreakPlugin extends CoreGamePlugin {
  public readonly gameId = 'synchroBreak'
  protected readonly gameName = 'シンクロブレイク'
  private nyokkiActionMessage: string | undefined = undefined
  private nyokkiStatus: NyokkiStatus = 'yet'

  private synchroBreakPluginStore!: SynchroBreakPluginStore
  private playerPluginStore!: PlayerPluginStore
  private synchroBreakDialogManager!: SynchroBreakDialogManager
  private scene!: Scene
  private coinViewerIconUis!: Map<string, CoinViewerIcon>
  private socketController!: SocketController

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('init', this.init.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )
    this.bus.subscribeEvent('phaserLoadAssets', this.loadAssets.bind(this))
    this.bus.subscribeEvent('registerGameUi', this.registerGameUi.bind(this))
  }

  /**
   * ゲームが開始された時に登録されるイベントリスナー
   */
  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('nyokkiTurnSelect', this.nyokkiTurnSelect)
    this.bus.subscribeEvent('timeLimitConfirm', this.timeLimitConfirm)
    this.bus.subscribeEvent('sendBetCoinResponse', this.sendBetCoinResponse)
    this.bus.subscribeEvent('nyokkiGameStartCount', this.gameStartCount)
    this.bus.subscribeEvent('nyokkiTurnTimer', this.turnTimer)
    this.bus.subscribeEvent('nyokkiActionResponse', this.nyokkiActionResponse)
    this.bus.subscribeEvent('nyokkiTurnEnd', this.nyokkiTurnEnd)
    this.bus.subscribeEvent('nyokkiTurnStart', this.nyokkiTurnStart)
    this.bus.subscribeEvent('updatePlayersCoin', this.updatePlayersCoin)
  }

  /**
   * ゲームが終了・中断された時に削除されるイベントリスナー
   */
  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('nyokkiTurnSelect', this.nyokkiTurnSelect)
    this.bus.unsubscribeEvent('timeLimitConfirm', this.timeLimitConfirm)
    this.bus.unsubscribeEvent('sendBetCoinResponse', this.sendBetCoinResponse)
    this.bus.unsubscribeEvent('nyokkiGameStartCount', this.gameStartCount)
    this.bus.unsubscribeEvent('nyokkiTurnTimer', this.turnTimer)
    this.bus.unsubscribeEvent('nyokkiActionResponse', this.nyokkiActionResponse)
    this.bus.unsubscribeEvent('nyokkiTurnEnd', this.nyokkiTurnEnd)
    this.bus.unsubscribeEvent('nyokkiTurnStart', this.nyokkiTurnStart)
    this.bus.unsubscribeEvent('updatePlayersCoin', this.updatePlayersCoin)
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.scene = ev.scene
  }

  private init(): void {
    this.synchroBreakDialogManager = new SynchroBreakDialogManager(this.store, this.bus)
    this.coinViewerIconUis = new Map<string, CoinViewerIcon>()
    this.gamePluginStore = this.store.of('gamePlugin')
    this.playerPluginStore = this.store.of('playerPlugin')
  }

  /**
   * シンクロブレイクゲームのアセットをロードする
   */
  private loadAssets(ev: PhaserLoadAssets): void {
    PlayerNyokkiStatusIcon.loadAssets(ev.scene)
    CoinViewer.loadAssets(ev.scene)
  }

  /**
   * ゲームUI登録のイベントを受け取った時の処理
   */
  private registerGameUi(ev: RegisterGameUiEvent): void {
    registerSynchroBreakUi(this.store, this.bus, this.scene, this.gameId, ev.gameUiRegister)
  }

  /**
   * シンクロブレイク特有の開始時に実行される処理
   */
  protected handleGameStart(): void {
    initSynchroBreakPluginStore(this.store)
    this.socketController.registerMessageListener()
    this.synchroBreakDialogManager.setGameAbortButtonText()
    this.synchroBreakPluginStore = this.store.of('synchroBreakPlugin')
    this.nyokkiActionMessage = undefined
    this.nyokkiStatus = 'yet'

    if (this.gameOwnerId === undefined) return
    const gameOwnerName = this.playerPluginStore.players.get(this.gameOwnerId)?.name ?? 'ゲームオーナー'
    const descriptionWindow = this.getDescriptionWindow()
    descriptionWindow.setGameName(this.gameName)
    descriptionWindow.setGameOwnerName(gameOwnerName)
    if (this.gameOwnerId === this.playerPluginStore.ownPlayerId) {
      descriptionWindow.setGameStartForHost()
      this.gamePluginStore.gameUiManager.getUi(this.gameId, 'turnSelectConfirm')?.open()
    } else {
      descriptionWindow.setGameStartForGuest()
    }
  }

  /**
   * ゲームの参加者が更新された時の処理
   */
  protected handleGameParticipant(): void {
    for (const playerId of this.participantIds) {
      const coinViewer = new CoinViewerIcon(this.scene, this.store, playerId)
      this.coinViewerIconUis.set(playerId, coinViewer)

      const playerRenderer = this.store.of('playerPlugin').playerRenderers.get(playerId)
      if (playerRenderer === undefined) throw new Error('playerRenderer is not found')
      const playerSynchroBreakIcon = new PlayerNyokkiStatusIcon(this.scene, playerRenderer)
      this.synchroBreakPluginStore.synchroBreakIcons.set(playerId, playerSynchroBreakIcon)
    }
  }

  /**
   * シンクロブレイク特有の中断・終了時に実行される処理
   */
  protected handleGameTermination(): void {
    resetSynchroBreakPluginStore(this.store)
    this.socketController.unregisterMessageListener()
    this.synchroBreakDialogManager.setGameStartButtonText()

    this.removeBetCoinUi()
    this.resetPlayerNyokkiIcon()
  }

  /**
   * シンクロブレイク特有の途中参加時の処理
   */
  protected handleMidwayParticipant(): void {
    this.subscribeGameEvent()
    this.socketController.registerMessageListener()
    this.synchroBreakDialogManager.setGameAbortButtonText()
  }

  /**
   * ターンが設定された時の処理
   */
  private readonly nyokkiTurnSelect = (ev: NyokkiTurnSelectEvent): void => {
    if (this.isOwnPlayerMidwayParticipant) return

    const rankingBoard = this.getRankingBoard()
    rankingBoard.updateTurnNumber(1, ev.allTurn)

    this.synchroBreakPluginStore.gameTurn = ev.allTurn

    const descriptionWindow = this.getDescriptionWindow()
    if (this.gameOwnerId === this.playerPluginStore.ownPlayerId) {
      descriptionWindow.setTimeLimitSelection(ev.allTurn)
      this.gamePluginStore.gameUiManager.getUi(this.gameId, 'timeLimitConfirm')?.open()
    } else {
      descriptionWindow.setTimeLimitWaiting(ev.allTurn)
    }
  }

  /**
   * タイムリミットが設定された際の処理
   */
  private readonly timeLimitConfirm = (ev: TimeLimitConfirmEvent): void => {
    if (this.isOwnPlayerMidwayParticipant) return
    this.synchroBreakPluginStore.timeLimit = Number(ev.timeLimit)

    const descriptionWindow = this.getDescriptionWindow()
    if (this.gameOwnerId === this.playerPluginStore.ownPlayerId) {
      descriptionWindow.setTimeLimitConfirmed(ev.timeLimit)
    } else {
      descriptionWindow.setTimeLimitAcknowledged(ev.timeLimit)
    }

    this.gamePluginStore.gameUiManager.getUi(this.gameId, 'betCoinConfirm')?.open()
  }

  /**
   * ベットコインが設定された際の処理
   */
  private readonly sendBetCoinResponse = (ev: SendBetCoinResponseEvent): void => {
    if (this.isOwnPlayerMidwayParticipant) return
    const playerId = ev.playerId
    const betCoins = ev.betCoins

    const coinViewerIcon = this.coinViewerIconUis.get(playerId)
    coinViewerIcon?.coinViewer?.setBetCoins(betCoins)

    const descriptionWindow = this.getDescriptionWindow()
    if (ev.playerId === this.playerPluginStore.ownPlayerId) {
      descriptionWindow.setBetCoinSelection(betCoins)
    }

    const rankingBoard = this.getRankingBoard()
    this.synchroBreakPluginStore.playersCoinRepository.set(playerId, ev.currentCoins)
    rankingBoard.updateRanking()
  }

  /**
   * ゲーム開始までのカウントダウンを表示する
   */
  private readonly gameStartCount = (ev: NyokkiGameStartCountEvent): void => {
    if (this.isOwnPlayerMidwayParticipant) return
    const descriptionWindow = this.getDescriptionWindow()
    descriptionWindow.setGameStartCountdown(ev.remainingSeconds)
  }

  /**
   * ターン中の残り時間を表示する
   */
  private readonly turnTimer = (ev: NyokkiTurnTimerEvent): void => {
    if (this.isOwnPlayerMidwayParticipant) return
    const descriptionWindow = this.getDescriptionWindow()
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    const ownPlayerName = this.playerPluginStore.players.get(ownPlayerId)?.name
    if (ev.remainingSeconds === this.synchroBreakPluginStore.timeLimit) {
      descriptionWindow.setSynchroBreakStart(ev.remainingSeconds)
      this.gamePluginStore.gameUiManager.getUi(this.gameId, 'nyokkiButton')?.open()
    } else {
      if (this.nyokkiStatus === 'yet') {
        descriptionWindow.setSynchroBreakInProgress(ev.remainingSeconds)
      } else {
        descriptionWindow.setSynchroBreakInProgress(ev.remainingSeconds, ownPlayerName, this.nyokkiActionMessage)
      }
    }
  }

  /**
   * ニョッキアクションの実行結果を受け取った際の処理
   */
  private readonly nyokkiActionResponse = (ev: NyokkiActionResponseEvent): void => {
    const nyokkiCollectionPlayerId = ev.sameTimePlayersId
    const nyokkiLogText = ev.nyokkiLogText
    this.gamePluginStore.gameLogRenderer.gameLog(nyokkiLogText, 0)
    let status: NyokkiStatus = 'success'
    if (!ev.isSuccess) status = 'nyokki'
    for (let i = 0; i < nyokkiCollectionPlayerId.length; i++) {
      const playerId = nyokkiCollectionPlayerId[i]
      const rankingBoard = this.getRankingBoard()
      rankingBoard.changeNyokkiStatus(playerId, status)

      // ニョッキアクションの実行結果をプレイヤーに通知する
      if (playerId === this.playerPluginStore.ownPlayerId) {
        const descriptionWindow = this.getDescriptionWindow()
        this.nyokkiActionMessage = ev.nyokkiLogText
        descriptionWindow.setNyokkiAction(ev.nyokkiLogText)
      }

      // シンクロブレイクのニョッキアクションUIを表示させる。
      this.synchroBreakPluginStore.synchroBreakIcons.get(playerId)?.handlePlayerSynchroBreakIcons(ev.order, status)
    }
  }

  /**
   * ターンが終了した際の処理
   */
  private readonly nyokkiTurnEnd = (ev: NyokkiTurnEndEvent): void => {
    if (this.isOwnPlayerMidwayParticipant) return
    this.gamePluginStore.gameUiManager.getUi(this.gameId, 'nyokkiButton')?.close()
    this.nyokkiActionMessage = undefined
    this.nyokkiStatus = 'yet'

    const descriptionWindow = this.getDescriptionWindow()
    descriptionWindow.setSynchroBreakEnd()
    const rankingBoard = this.getRankingBoard()
    const status: NyokkiStatus = 'nyokki'
    const noNyokkiPlayerIds = ev.noNyokkiPlayerIds
    for (let i = 0; i < noNyokkiPlayerIds.length; i++) {
      rankingBoard.changeNyokkiStatus(noNyokkiPlayerIds[i], status)
      this.synchroBreakPluginStore.synchroBreakIcons
        .get(noNyokkiPlayerIds[i])
        ?.handlePlayerSynchroBreakIcons(-1, status)
    }
  }

  /**
   * ターンが開始した際の処理
   */
  private readonly nyokkiTurnStart = (ev: NyokkiTurnStartEvent): void => {
    this.resetPlayerNyokkiIcon()
    this.removeBetCoinUi()
    const descriptionWindow = this.getDescriptionWindow()
    descriptionWindow.setTurnStart(ev.turnNumber)
    this.gamePluginStore.gameUiManager.getUi(this.gameId, 'betCoinConfirm')?.open()
  }

  /**
   * プレイヤーのコイン所持数が更新された際の処理
   */
  private readonly updatePlayersCoin = (ev: UpdatePlayersCoinEvent): void => {
    for (const playerCoin of ev.playersCoin) {
      this.synchroBreakPluginStore.playersCoinRepository.set(playerCoin.playerId, playerCoin.coins)
    }
    const rankingBoard = this.getRankingBoard()
    rankingBoard.updateRanking()
  }

  /**
   * ゲームの説明ウィンドウを取得する
   */
  private getDescriptionWindow(): IDescriptionText {
    const descriptionWindow = this.gamePluginStore.gameUiManager.getUi(this.gameId, 'descriptionText')
    if (descriptionWindow === undefined) throw new Error('descriptionWindow is not found')
    return descriptionWindow
  }

  /**
   * シンクロブレイクのランキングボードを取得する
   */
  private getRankingBoard(): IRankingBoard {
    const rankingBoard = this.gamePluginStore.gameUiManager.getUi(this.gameId, 'rankingBoard')
    if (rankingBoard === undefined) throw new Error('rankingBoard is not found')
    return rankingBoard
  }

  /**
   * ベットコインのUIを削除する
   */
  private removeBetCoinUi(): void {
    for (const playerId of this.coinViewerIconUis.keys()) {
      const coinViewerIcon = this.coinViewerIconUis.get(playerId)
      coinViewerIcon?.coinViewer?.removeBetUi()
    }
  }

  /**
   * ニョッキアクションのニョッキステータスアイコンをリセットする
   */
  private resetPlayerNyokkiIcon(): void {
    if (this.synchroBreakPluginStore.synchroBreakIcons === undefined) return
    this.synchroBreakPluginStore.synchroBreakIcons.forEach((value) => {
      value.resetStatusIcon()
    })
  }
}

declare module '@churaverse/game-plugin-client/interface/gameIds' {
  export interface GameIdsMap {
    synchroBreak: SynchroBreakPlugin
  }
}
