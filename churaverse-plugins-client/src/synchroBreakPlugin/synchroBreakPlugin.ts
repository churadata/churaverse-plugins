import { BaseGamePlugin } from '@churaverse/game-plugin-client/domain/baseGamePlugin'
import { GamePluginStore } from '@churaverse/game-plugin-client/store/defGamePluginStore'
import { RegisterGameUiEvent } from '@churaverse/game-plugin-client/event/registerGameUiEvent'
import { GameStartEvent } from '@churaverse/game-plugin-client/event/gameStartEvent'
import { SynchroBreakPluginStore } from './store/defSynchroBreakPluginStore'
import { SynchroBreakDialogManager } from './ui/startWindow/synchroBreakDialogManager'
import { initSynchroBreakPluginStore, resetSynchroBreakPluginStore } from './store/synchroBreakPluginStoreManager'
import { SocketController } from './controller/socketController'
import { NyokkiTurnSelectEvent } from './event/nyokkiTurnSelectEvent'
import { TimeLimitConfirmEvent } from './event/timeLimitConfirmEvent'
import { SendBetCoinEvent } from './event/sendBetCoinEvent'
// import { CoinViewerIcon } from './ui/coinViewer/coinViewerIcon'
import { registerSynchroBreakUi } from './ui/registerSynchroBreakUi'
import { IDescriptionWindow } from './interface/IDescriptionWindow'

export class SynchroBreakPlugin extends BaseGamePlugin {
  protected readonly gameId = 'synchroBreak'
  protected readonly gameName = 'シンクロブレイク'

  private synchroBreakPluginStore!: SynchroBreakPluginStore
  private gamePluginStore!: GamePluginStore
  private playerPluginStore!: PlayerPluginStore
  private synchroBreakDialogManager!: SynchroBreakDialogManager
  private socketController!: SocketController

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('init', this.init.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )

    this.bus.subscribeEvent('registerGameUi', this.registerGameUi.bind(this))
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
    this.synchroBreakDialogManager = new SynchroBreakDialogManager(this.store, this.bus)
    this.gamePluginStore = this.store.of('gamePlugin')
    this.playerPluginStore = this.store.of('playerPlugin')
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
    this.subscribeGameStartEvent()
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
      descriptionWindow.open(`シンクロブレイクが開始されました！<br>${gameOwnerName}さんがターンを入力中です。`)
    }
  }

  /**
   * シンクロブレイク特有の中断・終了時に実行される処理
   */
  protected handleGameTermination(): void {
    this.unsubscribeGameTerminationEvent()
    resetSynchroBreakPluginStore(this.store)
    this.socketController.unregisterMessageListener()
    this.synchroBreakDialogManager.setGameStartButtonText()
  }

  /**
   * シンクロブレイク特有の途中参加時の処理
   */
  protected handleMidwayParticipant(): void {
    this.subscribeGameStartEvent()
    this.socketController.registerMessageListener()
    this.synchroBreakDialogManager.setGameAbortButtonText()
  }

  /**
   * ターンが設定された時の処理
   */
  private readonly nyokkiTurnSelect = (ev: NyokkiTurnSelectEvent): void => {
    if (this.isOwnPlayerMidwayParticipant) return

    const gameOwnerName = this.playerPluginStore.players.get(ev.playerId)?.name

    const descriptionWindow = this.getDescriptionWindow()
    if (this.gameOwnerId === this.playerPluginStore.ownPlayerId) {
      descriptionWindow.setDescriptionText(`${ev.allTurn}ターン選択しました。<br>制限時間(3~15)を選択してください。`)
      this.gamePluginStore.gameUiManager.getUi(this.gameId, 'timeLimitConfirm')?.open()
    } else {
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
      this.gamePluginStore.gameUiManager.getUi(this.gameId, 'betCoinConfirm')?.open()
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
  private readonly sendBetCoin = (ev: SendBetCoinEvent): void => {
    if (this.isOwnPlayerMidwayParticipant) return

    const descriptionWindow = this.getDescriptionWindow()
    if (ev.playerId === this.playerPluginStore.ownPlayerId) {
      descriptionWindow.setDescriptionText(
        `ベットコインを${ev.betCoins}枚選択しました。<br>相手のベットコインを待っています。`
      )
    }
  }

  private getDescriptionWindow(): IDescriptionWindow {
    const descriptionWindow = this.gamePluginStore.gameUiManager.getUi(this.gameId, 'descriptionWindow')
    if (descriptionWindow === undefined) throw new Error('descriptionWindow is not found')
    return descriptionWindow
  }
}

declare module '@churaverse/game-plugin-client/interface/gameIds' {
  export interface GameIdsMap {
    synchroBreak: SynchroBreakPlugin
  }
}
