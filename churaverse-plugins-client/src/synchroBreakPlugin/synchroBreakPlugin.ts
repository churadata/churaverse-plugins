import { BaseGamePlugin } from '@churaverse/game-plugin-client/domain/baseGamePlugin'
import { GamePluginStore } from '@churaverse/game-plugin-client/store/defGamePluginStore'
import { PriorGameDataEvent } from '@churaverse/game-plugin-client/event/priorGameDataEvent'
import { RegisterGameUiEvent } from '@churaverse/game-plugin-client/event/registerGameUiEvent'
import { GameStartEvent } from '@churaverse/game-plugin-client/event/gameStartEvent'
import { GameAbortEvent } from '@churaverse/game-plugin-client/event/gameAbortEvent'
import { GameEndEvent } from '@churaverse/game-plugin-client/event/gameEndEvent'
import { PlayerPluginStore } from '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import { UpdateGameParticipantEvent } from '@churaverse/game-plugin-client/event/updateGameParticipantEvent'
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
    this.bus.subscribeEvent('init', this.init.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )

    this.bus.subscribeEvent('registerGameUi', this.registerGameUi.bind(this))
    this.bus.subscribeEvent('gameStart', this.gameStartSynchroBreak.bind(this))
    this.bus.subscribeEvent('priorGameData', this.priorGameData.bind(this))
  }

  /**
   * ゲームが開始された時に登録されるイベントリスナー
   */
  private addListenEvent(): void {
    this.bus.subscribeEvent('gameAbort', this.gameAbortSynchroBreak)
    this.bus.subscribeEvent('gameEnd', this.gameEndSynchroBreak)
    this.bus.subscribeEvent('nyokkiTurnSelect', this.nyokkiTurnSelect)
    this.bus.subscribeEvent('updateGameParticipant', this.gameParticipant)
    this.bus.subscribeEvent('timeLimitConfirm', this.timeLimitConfirm)
    this.bus.subscribeEvent('sendBetCoin', this.sendBetCoin)
  }

  /**
   * ゲームが終了・中断された時に削除されるイベントリスナー
   */
  private deleteListenEvent(): void {
    this.bus.unsubscribeEvent('gameAbort', this.gameAbortSynchroBreak)
    this.bus.unsubscribeEvent('gameEnd', this.gameEndSynchroBreak)
    this.bus.unsubscribeEvent('nyokkiTurnSelect', this.nyokkiTurnSelect)
    this.bus.unsubscribeEvent('updateGameParticipant', this.gameParticipant)
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
    this.addListenEvent()
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
    this.socketController.unregisterMessageListener()
    this.synchroBreakDialogManager.setGameStartButtonText()
    resetSynchroBreakPluginStore(this.store)
  }

  /**
   * ゲーム参加者のidリストを受け取り、ゲーム参加者リストを更新する
   */
  private readonly gameParticipant = (ev: UpdateGameParticipantEvent): void => {
    if (ev.gameId !== this.gameId) return
    this.updateParticipantIds(ev.participantIds)
  }

  /**
   * プレイヤーが参加した際に、シンクロブレイクが開始されているかを確認する
   */
  private priorGameData(ev: PriorGameDataEvent): void {
    if (ev.runningGameId !== this.gameId || this.isActive) return
    this.addListenEvent()
    this.socketController.registerMessageListener()
    this.synchroBreakDialogManager.setGameAbortButtonText()
    this.processMidwayParticipant()
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
