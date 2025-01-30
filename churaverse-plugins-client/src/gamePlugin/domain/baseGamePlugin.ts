import { BasePlugin, IMainScene, Store, IEventBus } from 'churaverse-engine-client'
import { GameIds } from '../interface/gameIds'
import { GameAbortEvent } from '../event/gameAbortEvent'
import { GameEndEvent } from '../event/gameEndEvent'
import { UpdateGameParticipantEvent } from '../event/updateGameParticipantEvent'
import { PriorGameDataEvent } from '../event/priorGameDataEvent'
import { GamePluginStore } from '../store/defGamePluginStore'

export abstract class BaseGamePlugin extends BasePlugin<IMainScene> {
  /** ゲーム一意のid */
  protected abstract readonly gameId: GameIds
  /** ゲーム名 */
  protected abstract readonly gameName: string
  /** ゲームの状態を保存する変数 */
  private _isActive: boolean
  /** ゲームを開始したプレイヤーid */
  private _gameOwnerId: string | undefined
  /** ゲーム参加者のプレイヤーid */
  private _participantIds: string[]
  /** 自プレイヤーが途中参加かどうかを示すフラグ */
  private _isOwnPlayerMidwayParticipant: boolean

  public constructor(store: Store<IMainScene>, bus: IEventBus<IMainScene>, sceneName: IMainScene['sceneName']) {
    super(store, bus, sceneName)
    this._isActive = false
    this._gameOwnerId = undefined
    this._participantIds = []
    this._isOwnPlayerMidwayParticipant = false
  }

  /**
   * ゲームの状態を取得する
   */
  protected get isActive(): boolean {
    return this._isActive
  }

  /**
   * ゲームを開始したプレイヤーidを取得する
   */
  protected get gameOwnerId(): string | undefined {
    return this._gameOwnerId
  }

  /**
   * ゲーム参加者のプレイヤーidリストを取得する
   */
  protected get participantIds(): string[] {
    return this._participantIds
  }

  /**
   * 自プレイヤーが途中参加かの有無を取得する
   */
  protected get isOwnPlayerMidwayParticipant(): boolean {
    return this._isOwnPlayerMidwayParticipant
  }

  public listenEvent(): void {
    this.bus.subscribeEvent('priorGameData', this.priorGameData.bind(this))
  }

  /**
   * ゲーム開始時に共通して登録されるイベントリスナー
   */
  protected addListenEvent(): void {
    this.bus.subscribeEvent('gameAbort', this.gameAbort)
    this.bus.subscribeEvent('gameEnd', this.gameEnd)
    this.bus.subscribeEvent('updateGameParticipant', this.updateGameParticipant)
  }

  /**
   * ゲームが中断・終了時に共通して削除されるイベントリスナー
   */
  protected deleteListenEvent(): void {
    this.bus.unsubscribeEvent('gameAbort', this.gameAbort)
    this.bus.unsubscribeEvent('gameEnd', this.gameEnd)
    this.bus.unsubscribeEvent('updateGameParticipant', this.updateGameParticipant)
  }

  /**
   * プレイヤーが参加した時に、ゲームが開始されているかを確認する。開始されている場合、必要な処理を実行する
   */
  private priorGameData(ev: PriorGameDataEvent): void {
    if (ev.runningGameId !== this.gameId || this.isActive) return
    this._isActive = true
    this._isOwnPlayerMidwayParticipant = true
    const gamePluginStore = this.store.of('gamePlugin')
    gamePluginStore.gameLogRenderer.gameLog(`${this.gameName}が開始されています。`, 400)
    this.handleMidwayParticipant()
  }

  /**
   * ゲーム特有の途中入室時の処理を実装するための抽象メソッド
   * 各ゲームプラグインでオーバーライドし、具体的なロジックを定義する
   */
  protected abstract handleMidwayParticipant(): void

  /**
   * ゲームの状態をアクティブにし、UI初期化と開始ログを表示する
   * @param playerId ゲームを開始したプレイヤーid
   */
  protected gameStart(playerId: string): void {
    this._isActive = true
    this._gameOwnerId = playerId
    const gamePluginStore = this.store.of('gamePlugin')
    gamePluginStore.gameUiManager.initializeAllUis(this.gameId)
    gamePluginStore.gameLogRenderer.gameStartLog(this.gameName, playerId)
  }

  /**
   * ゲームが中断した時の処理
   */
  private readonly gameAbort = (ev: GameAbortEvent): void => {
    if (ev.gameId !== this.gameId) return
    const gamePluginStore = this.store.of('gamePlugin')
    gamePluginStore.gameLogRenderer.gameAbortLog(this.gameName, ev.playerId)
    this.terminateGame(gamePluginStore)
  }

  /**
   * ゲームが終了した時の処理
   */
  private readonly gameEnd = (ev: GameEndEvent): void => {
    if (ev.gameId !== this.gameId) return
    const gamePluginStore = this.store.of('gamePlugin')
    gamePluginStore.gameLogRenderer.gameEndLog(this.gameName)
    this.terminateGame(gamePluginStore)
  }

  /**
   * ゲームが中断・終了された時の共通処理を実行する
   * ゲームの状態を非アクティブにする
   */
  private terminateGame(gamePluginStore: GamePluginStore): void {
    this._isActive = false
    this._gameOwnerId = undefined
    this.clearParticipantIds()
    if (!this.isOwnPlayerMidwayParticipant) {
      gamePluginStore.gameUiManager.removeAllUis(this.gameId)
    } else {
      this._isOwnPlayerMidwayParticipant = false
    }
    this.handleGameTermination()
  }

  /**
   * ゲーム特有の中断・終了時の処理を実装するための抽象メソッド
   * 各ゲームプラグインでオーバーライドし、具体的なロジックを定義する
   */
  protected abstract handleGameTermination(): void

  /**
   * ゲーム参加者のidリストを受け取り、ゲーム参加者リストを更新する
   */
  private readonly updateGameParticipant = (ev: UpdateGameParticipantEvent): void => {
    if (ev.gameId !== this.gameId) return
    this._participantIds = ev.participantIds
  }
  /**
   * ゲーム参加者のプレイヤーidリストをクリアする
   */
  private clearParticipantIds(): void {
    this._participantIds = []
  }
}
