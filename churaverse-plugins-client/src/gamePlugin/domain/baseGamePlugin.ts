import { BasePlugin, IMainScene, Store, IEventBus } from 'churaverse-engine-client'
import { GameIds } from '../interface/gameIds'

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
   * ゲームの状態を非アクティブにし、UI削除と中断ログを表示する
   * @param playerId ゲームを中断したプレイヤーid
   */
  protected gameAbort(playerId: string): void {
    this._isActive = false
    this._gameOwnerId = undefined
    const gamePluginStore = this.store.of('gamePlugin')
    gamePluginStore.gameLogRenderer.gameAbortLog(this.gameName, playerId)
    this.clearParticipantIds()
    if (!this.isOwnPlayerMidwayParticipant) {
      gamePluginStore.gameUiManager.removeAllUis(this.gameId)
    } else {
      this._isOwnPlayerMidwayParticipant = false
    }
  }

  /**
   * ゲームの状態を非アクティブにし、UI削除と終了ログを表示する
   */
  protected gameEnd(): void {
    this._isActive = false
    this._gameOwnerId = undefined
    const gamePluginStore = this.store.of('gamePlugin')
    gamePluginStore.gameLogRenderer.gameEndLog(this.gameName)
    this.clearParticipantIds()
    if (!this.isOwnPlayerMidwayParticipant) {
      gamePluginStore.gameUiManager.removeAllUis(this.gameId)
    } else {
      this._isOwnPlayerMidwayParticipant = false
    }
  }

  /**
   * ゲーム参加者のプレイヤーidを登録する
   * @param participantIds ゲーム参加者のプレイヤーidリスト
   */
  protected updateParticipantIds(participantIds: string[]): void {
    this._participantIds = participantIds
  }

  /**
   * ゲーム参加者のプレイヤーidリストをクリアする
   */
  private clearParticipantIds(): void {
    this._participantIds = []
  }

  /**
   * 途中参加したプレイヤーの処理を行う
   */
  protected processMidwayParticipant(): void {
    this._isOwnPlayerMidwayParticipant = true
    const gamePluginStore = this.store.of('gamePlugin')
    gamePluginStore.gameLogRenderer.gameLog(`${this.gameName}が開始されています。`, 400)
  }
}
