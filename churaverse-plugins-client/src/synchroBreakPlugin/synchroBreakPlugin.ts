import { PhaserLoadAssets, PhaserSceneInit } from 'churaverse-engine-client'
import { Scene } from 'phaser'
import { CoreGamePlugin } from '@churaverse/game-plugin-client/domain/coreGamePlugin'
import { RegisterGameUiEvent } from '@churaverse/game-plugin-client/event/registerGameUiEvent'
import { PlayerPluginStore } from '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import { UpdateGameParticipantEvent } from '@churaverse/game-plugin-client/event/updateGameParticipantEvent'
import { SynchroBreakPluginStore } from './store/defSynchroBreakPluginStore'
import { SynchroBreakDialogManager } from './ui/startWindow/synchroBreakDialogManager'
import { initSynchroBreakPluginStore, resetSynchroBreakPluginStore } from './store/synchroBreakPluginStoreManager'
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
import { SynchroBreakEndEvent } from './event/synchroBreakEndEvent'
import { SynchroBreakEndMessage } from './message/synchroBreakEndMessage'

export class SynchroBreakPlugin extends CoreGamePlugin {
  public readonly gameId = 'synchroBreak'
  protected readonly gameName = 'シンクロブレイク'

  private synchroBreakPluginStore!: SynchroBreakPluginStore
  private playerPluginStore!: PlayerPluginStore
  private synchroBreakDialogManager!: SynchroBreakDialogManager
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
    this.bus.subscribeEvent('updateGameParticipant', this.handleGameParticipant)
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
    this.bus.subscribeEvent('synchroBreakEnd', this.synchroBreakEnd)
  }

  /**
   * ゲームが終了・中断された時に削除されるイベントリスナー
   */
  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('updateGameParticipant', this.handleGameParticipant)
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
    this.bus.unsubscribeEvent('synchroBreakEnd', this.synchroBreakEnd)
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

    if (this.gameOwnerId === undefined) return
    const gameOwnerName = this.playerPluginStore.players.get(this.gameOwnerId)?.name
    const descriptionWindow = this.getDescriptionWindow()
    if (this.gameOwnerId === this.playerPluginStore.ownPlayerId) {
      descriptionWindow.open(
        `ニョッキゲームを開始しました。<br>あなたはゲームの管理者です。 <br>ターン数(1~10)を選択してください。`
      )
      this.gamePluginStore.gameUiManager.getUi(this.gameId, 'turnSelectConfirm')?.open()
    } else {
      descriptionWindow.open(`${this.gameName}が開始されました！<br>${gameOwnerName}さんがターンを入力中です。`)
    }
  }

  /**
   * シンクロブレイク特有の中断・終了時に実行される処理
   */
  protected handleGameTermination(): void {
    this.socketController.unregisterMessageListener()
    this.synchroBreakDialogManager.setGameStartButtonText()

    if (!this.isOwnPlayerMidwayParticipant) {
      resetSynchroBreakPluginStore(this.store)
      this.removeSynchroBreakIcons()
    }
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
   * ゲームの参加者が更新された時の処理
   */
  private readonly handleGameParticipant = (ev: UpdateGameParticipantEvent): void => {
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
   * ターンが設定された時の処理
   */
  private readonly synchroBreakTurnSelect = (ev: SynchroBreakTurnSelectEvent): void => {
    if (this.isOwnPlayerMidwayParticipant) return

    this.getRankingBoard.updateTurnNumber(1, ev.allTurn)

    this.synchroBreakPluginStore.gameTurn = ev.allTurn

    const descriptionWindow = this.getDescriptionWindow()
    if (this.gameOwnerId === this.playerPluginStore.ownPlayerId) {
      descriptionWindow.setDescriptionText(`${ev.allTurn}ターン選択しました。<br>制限時間(3~15)を選択してください。`)
      this.gamePluginStore.gameUiManager.getUi(this.gameId, 'timeLimitConfirm')?.open()
    } else {
      const gameOwnerName = this.playerPluginStore.players.get(ev.playerId)?.name
      descriptionWindow.setDescriptionText(
        `${ev.allTurn}ターン選択されました。<br>${gameOwnerName}さんが制限時間を入力中です。`
      )
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
      descriptionWindow.setDescriptionText(
        `制限時間を${ev.timeLimit}秒選択しました。<br>ベットコインを入力してください。`
      )
    } else {
      descriptionWindow.setDescriptionText(
        `制限時間が${ev.timeLimit}秒選択されました。<br>ベットコインを入力してください。`
      )
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

    const descriptionWindow = this.getDescriptionWindow()
    if (ev.playerId === this.playerPluginStore.ownPlayerId) {
      descriptionWindow.setDescriptionText(
        `ベットコインを${ev.betCoins}枚選択しました。<br>相手のベットコインを待っています。`
      )
    }

    this.synchroBreakPluginStore.playersCoinRepository.set(ev.playerId, ev.currentCoins)
    this.getRankingBoard.updateRanking()
  }

  /**
   * ゲーム開始までのカウントダウンを表示する
   */
  private readonly gameStartCount = (ev: SynchroBreakStartCountEvent): void => {
    if (this.isOwnPlayerMidwayParticipant) return
    const descriptionWindow = this.getDescriptionWindow()
    descriptionWindow.setDescriptionText(`ゲーム開始まで<br>${ev.remainingSeconds}秒`)
  }

  /**
   * ターン中の残り時間を表示する
   */
  private readonly turnTimer = (ev: SynchroBreakTurnTimerEvent): void => {
    if (this.isOwnPlayerMidwayParticipant) return
    const descriptionWindow = this.getDescriptionWindow()
    if (ev.remainingSeconds === this.synchroBreakPluginStore.timeLimit) {
      descriptionWindow.setDescriptionText(
        `シンクロブレイク開始！！！<br>残り${ev.remainingSeconds}秒以内にボタンを押してください！`
      )
      this.gamePluginStore.gameUiManager.getUi(this.gameId, 'nyokkiButton')?.open()
    } else {
      descriptionWindow.setDescriptionText(
        `現在シンクロブレイク進行中<br>残り${ev.remainingSeconds}秒以内にボタンを押してください！`
      )
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
    const noNyokkiPlayerIds = ev.noNyokkiPlayerIds
    const status: NyokkiStatus = 'nyokki'
    const descriptionWindow = this.getDescriptionWindow()

    this.gamePluginStore.gameUiManager.getUi(this.gameId, 'nyokkiButton')?.close()
    descriptionWindow.setDescriptionText(`シンクロブレイクのターンが終了しました！！！！`)

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
    const descriptionWindow = this.getDescriptionWindow()
    descriptionWindow.setDescriptionText(`${ev.turnNumber}ターン目です。<br>ベットコインを入力してください。`)
    this.gamePluginStore.gameUiManager.getUi(this.gameId, 'betCoinConfirm')?.open()

    const gameTurn = this.synchroBreakPluginStore.gameTurn
    if (gameTurn === undefined) throw new Error('gameTurn is not found')
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
    this.gamePluginStore.gameUiManager.getUi(this.gameId, 'rankingBoard')?.remove()
    this.gamePluginStore.gameUiManager.getUi(this.gameId, 'nyokkiButton')?.remove()
    this.gamePluginStore.gameUiManager
      .getUi(this.gameId, 'descriptionWindow')
      ?.setDescriptionText(
        '〜最終ランキング〜</br>お疲れ様でした。</br>閉じるボタンを押すと通常のちゅらバースに戻ります。'
      )
    this.gamePluginStore.gameUiManager.getUi(this.gameId, 'resultScreen')?.createResultRanking()
  }

  /**
   * 結果ウィンドウの閉じるボタンを押した時に実行される処理
   */
  private readonly synchroBreakEnd = (ev: SynchroBreakEndEvent): void => {
    if (ev.playerId !== this.playerPluginStore.ownPlayerId) return
    this.removeSynchroBreakIcons()
    this.gamePluginStore.gameUiManager.getUi(this.gameId, 'rankingBoard')?.remove()
    this.gamePluginStore.gameUiManager.getUi(this.gameId, 'descriptionWindow')?.close()
    this.store.of('networkPlugin').messageSender.send(new SynchroBreakEndMessage({ playerId: ev.playerId }))
  }

  /**
   * ゲームの説明ウィンドウを取得する
   */
  private getDescriptionWindow(): IDescriptionWindow {
    const descriptionWindow = this.gamePluginStore.gameUiManager.getUi(this.gameId, 'descriptionWindow')
    if (descriptionWindow === undefined) throw new Error('descriptionWindow is not found')
    return descriptionWindow
  }

  /**
   * シンクロブレイクのランキングボードを取得する
   */
  private get getRankingBoard(): IRankingBoard {
    const rankingBoard = this.gamePluginStore.gameUiManager.getUi(this.gameId, 'rankingBoard')
    if (rankingBoard === undefined) throw new Error('rankingBoard is not found')
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
