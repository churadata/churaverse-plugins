import { PhaserLoadAssets, PhaserSceneInit } from 'churaverse-engine-client'
import { Scene } from 'phaser'
import { CoreGamePlugin } from '@churaverse/game-plugin-client/domain/coreGamePlugin'
import { RegisterGameUiEvent } from '@churaverse/game-plugin-client/event/registerGameUiEvent'
import { PlayerPluginStore } from '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import { PlayerRendererNotFoundError } from '@churaverse/player-plugin-client/errors/playerRendererNotFoundError'
import { SynchroBreakPluginStore } from './store/defSynchroBreakPluginStore'
import { initSynchroBreakPluginStore, resetSynchroBreakPluginStore } from './store/synchroBreakPluginStoreManager'
import { SynchroBreakPluginError } from './errors/synchroBreakPluginError'
import { SynchroBreakUiNotFoundError } from './errors/synchroBreakUiNotFoundError'
import { SocketController } from './controller/socketController'
import { SynchroBreakTurnSelectEvent } from './event/synchroBreakTurnSelectEvent'
import { TimeLimitConfirmEvent } from './event/timeLimitConfirmEvent'
import { SendBetCoinResponseEvent } from './event/sendBetCoinResponseEvent'
import { registerSynchroBreakUi } from './ui/registerSynchroBreakUi'
import { IDescriptionWindow } from './interface/IDescriptionWindow'
import { PlayerNyokkiStatusIcon } from './ui/synchroBreakIcon/playerNyokkiStatusIcon'
import { CoinViewer } from './ui/coinViewer/coinViewer'
import { CoinViewerIcon } from './ui/coinViewer/coinViewerIcon'
import { SynchroBreakStartCountEvent } from './event/synchroBreakStartCountEvent'
import { SynchroBreakTurnTimerEvent } from './event/synchroBreakTurnTimerEvent'
import { NyokkiActionResponseEvent } from './event/nyokkiActionResponseEvent'
import { SynchroBreakTurnEndEvent } from './event/synchroBreakTurnEndEvent'
import { SynchroBreakTurnStartEvent } from './event/synchroBerakTurnStartEvent'
import { UpdatePlayersCoinEvent } from './event/updatePlayersCoinEvent'
import { NyokkiStatus } from './type/nyokkiStatus'
import { IRankingBoard } from './interface/IRankingBoard'
import { IGameSelectionListItemRenderer } from '@churaverse/game-plugin-client/interface/IGameSelectionListItemRenderer'
import { SynchroBreakListItemRenderer } from './ui/startWindow/synchroBreakListItemRenderer'
import { CoreUiPluginStore } from '@churaverse/core-ui-plugin-client/store/defCoreUiPluginStore'

export class SynchroBreakPlugin extends CoreGamePlugin {
  public readonly gameId = 'synchroBreak'
  protected readonly gameName = 'シンクロブレイク'
  private nyokkiActionMessage: string | undefined = undefined
  private ownNyokkiSatatus: NyokkiStatus = 'yet'
  protected gameEntryRenderer!: IGameSelectionListItemRenderer

  private synchroBreakPluginStore!: SynchroBreakPluginStore
  private playerPluginStore!: PlayerPluginStore
  private coreUiPluginStore!: CoreUiPluginStore
  private scene!: Scene
  private coinViewerIconUis = new Map<string, CoinViewerIcon>()
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
    this.bus.subscribeEvent('synchroBreakTurnSelect', this.synchroBreakTurnSelect)
    this.bus.subscribeEvent('timeLimitConfirm', this.timeLimitConfirm)
    this.bus.subscribeEvent('sendBetCoinResponse', this.sendBetCoinResponse)
    this.bus.subscribeEvent('synchroBreakStartCount', this.gameStartCount)
    this.bus.subscribeEvent('synchroBreakTurnTimer', this.turnTimer)
    this.bus.subscribeEvent('nyokkiActionResponse', this.nyokkiActionResponse)
    this.bus.subscribeEvent('synchroBreakTurnEnd', this.synchroBreakTurnEnd)
    this.bus.subscribeEvent('synchroBreakTurnStart', this.synchroBreakTurnStart)
    this.bus.subscribeEvent('updatePlayersCoin', this.updatePlayersCoin)
    this.bus.subscribeEvent('synchroBreakResult', this.showSynchroBreakResult)
  }

  /**
   * ゲームが終了・中断された時に削除されるイベントリスナー
   */
  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('synchroBreakTurnSelect', this.synchroBreakTurnSelect)
    this.bus.unsubscribeEvent('timeLimitConfirm', this.timeLimitConfirm)
    this.bus.unsubscribeEvent('sendBetCoinResponse', this.sendBetCoinResponse)
    this.bus.unsubscribeEvent('synchroBreakStartCount', this.gameStartCount)
    this.bus.unsubscribeEvent('synchroBreakTurnTimer', this.turnTimer)
    this.bus.unsubscribeEvent('nyokkiActionResponse', this.nyokkiActionResponse)
    this.bus.unsubscribeEvent('synchroBreakTurnEnd', this.synchroBreakTurnEnd)
    this.bus.unsubscribeEvent('synchroBreakTurnStart', this.synchroBreakTurnStart)
    this.bus.unsubscribeEvent('updatePlayersCoin', this.updatePlayersCoin)
    this.bus.unsubscribeEvent('synchroBreakResult', this.showSynchroBreakResult)
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.scene = ev.scene
  }

  private init(): void {
    this.coinViewerIconUis = new Map<string, CoinViewerIcon>()
    this.gameInfoStore = this.store.of('gameInfo')
    this.gamePluginStore = this.store.of('gamePlugin')
    this.playerPluginStore = this.store.of('playerPlugin')
    this.coreUiPluginStore = this.store.of('coreUiPlugin')
    this.gameEntryRenderer = new SynchroBreakListItemRenderer(
      this.store,
      this.gamePluginStore.gameDescriptionDialogManager,
      this.gamePluginStore.gameSelectionListContainer
    )
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
    // ゲーム専用の中断文言セット
    this.gamePluginStore.gameAbortAlertConfirm.setMessage('シンクロブレイクを中断しますか？')
    // 退出アラート文言をセット
    if (this.gameOwnerId === this.playerPluginStore.ownPlayerId) {
      this.coreUiPluginStore.exitButton.setMessage(
        'あなたはゲームオーナーです。あなたが退出するとシンクロブレイクが終了します'
      )
    } else {
      this.coreUiPluginStore.exitButton.setMessage('シンクロブレイクから退出しますか？')
    }

    initSynchroBreakPluginStore(this.store)
    this.socketController.registerMessageListener()
    this.synchroBreakPluginStore = this.store.of('synchroBreakPlugin')
    this.initSynchroBreakPlayerIcons()
    this.nyokkiActionMessage = undefined
    this.ownNyokkiSatatus = 'yet'

    if (this.gameOwnerId === undefined) return
    const gameOwnerName = this.playerPluginStore.players.get(this.gameOwnerId)?.name ?? 'ゲームオーナー'
    this.descriptionWindow.setGameBaseInfo(this.gameName, gameOwnerName)
    if (this.gameOwnerId === this.playerPluginStore.ownPlayerId) {
      this.descriptionWindow.displayGameStartForOwner()
      this.gamePluginStore.gameUiManager.getUi(this.gameId, 'turnSelectConfirm')?.open()
    } else {
      this.descriptionWindow.displayGameStartForGuest()
    }
  }

  /**
   * シンクロブレイク特有の中断・終了時に実行される処理
   */
  protected handleGameTermination(): void {
    this.coreUiPluginStore.exitButton.setMessage('このミーティングから退出しますか？')
    resetSynchroBreakPluginStore(this.store)
    this.socketController.unregisterMessageListener()

    if (!this.isOwnPlayerMidwayParticipant) {
      resetSynchroBreakPluginStore(this.store)
      this.removeSynchroBreakIcons()
    }
  }

  /**
   * シンクロブレイク特有の途中参加時の処理
   */
  protected handleMidwayParticipant(): void {
    this.socketController.registerMessageListener()
  }

  /**
   * プレイヤーがちゅらバースから退出した時の処理
   * @param playerId 退出したプレイヤーのID
   */
  protected handlePlayerLeave(playerId: string): void {
    this.synchroBreakPluginStore.playersCoinRepository.delete(playerId)
  }

  /**
   * シンクロブレイクを離脱した時の処理
   * 結果ウィンドウの閉じるボタンを押した時に実行される
   */
  protected handlePlayerQuitGame(playerId: string): void {
    this.removeSynchroBreakIcons()
    this.gamePluginStore.gameUiManager.getUi(this.gameId, 'rankingBoard')?.remove()
    this.gamePluginStore.gameUiManager.getUi(this.gameId, 'descriptionWindow')?.close()
  }

  /**
   * シンクロブレイク参加プレイヤーのUIアイコンを初期化する
   */
  private initSynchroBreakPlayerIcons(): void {
    for (const playerId of this.participantIds) {
      const coinViewer = new CoinViewerIcon(this.scene, this.store, playerId)
      this.coinViewerIconUis.set(playerId, coinViewer)

      const playerRenderer = this.store.of('playerPlugin').playerRenderers.get(playerId)
      if (playerRenderer === undefined) throw new PlayerRendererNotFoundError(playerId)
      const playerSynchroBreakIcon = new PlayerNyokkiStatusIcon(this.scene, playerRenderer)
      this.synchroBreakPluginStore.synchroBreakIcons.set(playerId, playerSynchroBreakIcon)
    }
  }

  /**
   * ターンが設定された時の処理
   */
  private readonly synchroBreakTurnSelect = (ev: SynchroBreakTurnSelectEvent): void => {
    if (this.isOwnPlayerMidwayParticipant) return

    this.getRankingBoard.updateTurnNumber(1, ev.allTurn)

    this.synchroBreakPluginStore.gameTurn = ev.allTurn

    if (this.gameOwnerId === this.playerPluginStore.ownPlayerId) {
      this.descriptionWindow.displayTurnSelectionForOwner(ev.allTurn)
      this.gamePluginStore.gameUiManager.getUi(this.gameId, 'timeLimitConfirm')?.open()
    } else {
      this.descriptionWindow.displayTurnSelectionForGuest(ev.allTurn)
    }
  }

  /**
   * タイムリミットが設定された際の処理
   */
  private readonly timeLimitConfirm = (ev: TimeLimitConfirmEvent): void => {
    if (this.isOwnPlayerMidwayParticipant) return
    this.synchroBreakPluginStore.timeLimit = Number(ev.timeLimit)

    const ownPlayerId = this.playerPluginStore.ownPlayerId
    const ownCoins = this.synchroBreakPluginStore.playersCoinRepository.get(ownPlayerId)

    if (this.gameOwnerId === this.playerPluginStore.ownPlayerId) {
      this.descriptionWindow.displayTimeLimitSelectionForOwner(ev.timeLimit, ownCoins)
    } else {
      this.descriptionWindow.displayTimeLimitSelectionForGuest(ev.timeLimit, ownCoins)
    }

    this.gamePluginStore.gameUiManager.getUi(this.gameId, 'betCoinConfirm')?.open()
  }

  /**
   * ベットコインが設定された際の処理
   */
  private readonly sendBetCoinResponse = (ev: SendBetCoinResponseEvent): void => {
    if (this.isOwnPlayerMidwayParticipant) return

    const coinViewerIcon = this.coinViewerIconUis.get(ev.playerId)
    coinViewerIcon?.coinViewer?.setBetCoins(ev.betCoins)

    if (ev.playerId === this.playerPluginStore.ownPlayerId) {
      this.descriptionWindow.displayBetCoinSelection(ev.betCoins)
    }

    this.synchroBreakPluginStore.playersCoinRepository.set(ev.playerId, ev.currentCoins)
    this.getRankingBoard.updateRanking()
  }

  /**
   * ゲーム開始までのカウントダウンを表示する
   */
  private readonly gameStartCount = (ev: SynchroBreakStartCountEvent): void => {
    if (this.isOwnPlayerMidwayParticipant) return
    this.descriptionWindow.displayGameStartCountdown(ev.remainingSeconds)
  }

  /**
   * ターン中の残り時間を表示する
   */
  private readonly turnTimer = (ev: SynchroBreakTurnTimerEvent): void => {
    if (this.isOwnPlayerMidwayParticipant) return
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    const ownPlayerName = this.playerPluginStore.players.get(ownPlayerId)?.name
    if (ev.remainingSeconds === this.synchroBreakPluginStore.timeLimit) {
      this.descriptionWindow.displaySynchroBreakStart(ev.remainingSeconds)
      this.gamePluginStore.gameUiManager.getUi(this.gameId, 'nyokkiButton')?.open()
    } else {
      if (this.ownNyokkiSatatus === 'yet') {
        this.descriptionWindow.displaySynchroBreakInProgress(ev.remainingSeconds)
      } else {
        this.descriptionWindow.displaySynchroBreakInProgress(
          ev.remainingSeconds,
          ownPlayerName,
          this.nyokkiActionMessage
        )
      }
    }
  }

  /**
   * ニョッキアクションの実行結果を受け取った際の処理
   */
  private readonly nyokkiActionResponse = (ev: NyokkiActionResponseEvent): void => {
    if (this.isOwnPlayerMidwayParticipant) return
    const nyokkiCollectionPlayerIds = ev.sameTimePlayersId
    const isSuccess = ev.isSuccess

    const nyokkiLogText = this.synchroBreakPluginStore.nyokkiLogTextCreator.createNyokkiLogText(
      nyokkiCollectionPlayerIds,
      isSuccess,
      ev.nyokkiTime
    )
    this.gamePluginStore.gameLogRenderer.gameLog(nyokkiLogText, 0)

    const status: NyokkiStatus = isSuccess ? 'success' : 'nyokki'
    for (const nyokkiCollectionPlayerId of nyokkiCollectionPlayerIds) {
      this.getRankingBoard.changeNyokkiStatus(nyokkiCollectionPlayerId, status)

      // ニョッキアクションの実行結果をプレイヤーに通知する
      if (nyokkiCollectionPlayerId === this.playerPluginStore.ownPlayerId) {
        this.ownNyokkiSatatus = status
        this.nyokkiActionMessage = nyokkiLogText
        this.descriptionWindow.displayNyokkiAction(nyokkiLogText)
      }

      // シンクロブレイクのニョッキアクションUIを表示させる。
      this.synchroBreakPluginStore.synchroBreakIcons
        .get(nyokkiCollectionPlayerId)
        ?.handlePlayerSynchroBreakIcons(ev.order, status)
    }
  }

  /**
   * ターンが終了した際の処理
   */
  private readonly synchroBreakTurnEnd = (ev: SynchroBreakTurnEndEvent): void => {
    if (this.isOwnPlayerMidwayParticipant) return
    this.gamePluginStore.gameUiManager.getUi(this.gameId, 'nyokkiButton')?.close()
    this.nyokkiActionMessage = undefined
    this.ownNyokkiSatatus = 'yet'

    this.descriptionWindow.displaySynchroBreakEnd()
    const noNyokkiPlayerIds = ev.noNyokkiPlayerIds
    const status: NyokkiStatus = 'nyokki'

    this.gamePluginStore.gameUiManager.getUi(this.gameId, 'nyokkiButton')?.close()
    this.descriptionWindow.displaySynchroBreakEnd()

    if (noNyokkiPlayerIds.length === 0) return
    for (const noNyokkiPlayerId of noNyokkiPlayerIds) {
      this.getRankingBoard.changeNyokkiStatus(noNyokkiPlayerId, status)
      this.synchroBreakPluginStore.synchroBreakIcons.get(noNyokkiPlayerId)?.handlePlayerSynchroBreakIcons(-1, status)
    }

    const noNyokkiLogText = this.synchroBreakPluginStore.nyokkiLogTextCreator.createNoNyokkiLogText(noNyokkiPlayerIds)
    this.gamePluginStore.gameLogRenderer.gameLog(noNyokkiLogText, 100)
  }

  /**
   * ターンが開始した際の処理
   */
  private readonly synchroBreakTurnStart = (ev: SynchroBreakTurnStartEvent): void => {
    if (this.isOwnPlayerMidwayParticipant) return
    this.resetPlayerNyokkiIcon()
    this.removeBetCoinUi()
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    const ownCoins = this.synchroBreakPluginStore.playersCoinRepository.get(ownPlayerId)

    const gameTurn = this.synchroBreakPluginStore.gameTurn
    if (gameTurn === undefined) throw new SynchroBreakPluginError('ターン情報が存在しません')

    const turnLeft = gameTurn - ev.turnNumber + 1
    this.descriptionWindow.displayTurnStart(turnLeft, ownCoins)
    this.gamePluginStore.gameUiManager.getUi(this.gameId, 'betCoinConfirm')?.open()

    this.getRankingBoard.updateTurnNumber(ev.turnNumber, gameTurn)
  }

  /**
   * プレイヤーのコイン所持数が更新された際の処理
   */
  private readonly updatePlayersCoin = (ev: UpdatePlayersCoinEvent): void => {
    if (this.isOwnPlayerMidwayParticipant) return
    for (const playerCoin of ev.playersCoin) {
      this.synchroBreakPluginStore.playersCoinRepository.set(playerCoin.playerId, playerCoin.coins)
    }
    this.getRankingBoard.updateRanking()
  }

  /**
   * ゲーム終了後の結果ウィンドウ表示処理
   */
  private readonly showSynchroBreakResult = (): void => {
    if (this.isOwnPlayerMidwayParticipant) return
    this.gamePluginStore.gameUiManager.getUi(this.gameId, 'rankingBoard')?.remove()
    this.gamePluginStore.gameUiManager.getUi(this.gameId, 'nyokkiButton')?.remove()
    this.gamePluginStore.gameUiManager.getUi(this.gameId, 'descriptionWindow')?.displayResultMessage()
    this.gamePluginStore.gameUiManager.getUi(this.gameId, 'resultScreen')?.createResultRanking()
  }

  /**
   * ゲームの説明ウィンドウを取得する
   */
  private get descriptionWindow(): IDescriptionWindow {
    const descriptionWindow = this.gamePluginStore.gameUiManager.getUi(this.gameId, 'descriptionWindow')
    if (descriptionWindow === undefined) throw new SynchroBreakUiNotFoundError('descriptionWindow')
    return descriptionWindow
  }

  /**
   * シンクロブレイクのランキングボードを取得する
   */
  private get getRankingBoard(): IRankingBoard {
    const rankingBoard = this.gamePluginStore.gameUiManager.getUi(this.gameId, 'rankingBoard')
    if (rankingBoard === undefined) throw new SynchroBreakUiNotFoundError('rankingBoard')
    return rankingBoard
  }

  /**
   * プレイヤーの周囲のアイコンを削除する
   */
  private removeSynchroBreakIcons(): void {
    this.resetPlayerNyokkiIcon()
    this.removeBetCoinUi()
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
