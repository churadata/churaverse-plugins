import { BasePlugin, IMainScene, Store, IEventBus } from 'churaverse-engine-server'
import '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import '@churaverse/player-plugin-server/store/defPlayerPluginStore'
import { GameIds } from '../interface/gameIds'
import { ResponseGameStartMessage } from '../message/gameStartMessage'
import { UpdateGameParticipantMessage } from '../message/updateGameParticipantMessage'
import { ResponseGameAbortMessage } from '../message/gameAbortMessage'
import { ResponseGameEndMessage } from '../message/gameEndMessage'

export abstract class BaseGamePlugin extends BasePlugin<IMainScene> {
  /** ゲーム一意のid */
  protected abstract readonly gameId: GameIds
  /** ゲームの状態を保存する変数 */
  private _isActive: boolean
  /** ゲームを開始したプレイヤーid */
  private _gameOwnerId: string | undefined
  /** ゲーム参加者のプレイヤーid */
  private _participantIds: string[]

  public constructor(store: Store<IMainScene>, bus: IEventBus<IMainScene>) {
    super(store, bus)
    this._isActive = false
    this._participantIds = []
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
   * ゲームの状態をアクティブにし、ゲーム開始と参加者を通知する
   * @param playerId ゲームを開始したプレイヤーid
   */
  protected gameStart(playerId: string): void {
    this._isActive = true
    this._gameOwnerId = playerId
    const participantIds = this.store.of('playerPlugin').players.getAllId()
    this._participantIds = participantIds
    const responseGameStartMessage = new ResponseGameStartMessage({ gameId: this.gameId, playerId })
    const networkPluginStore = this.store.of('networkPlugin')
    networkPluginStore.messageSender.send(responseGameStartMessage)
    const gameParticipantMessage = new UpdateGameParticipantMessage({ gameId: this.gameId, participantIds })
    networkPluginStore.messageSender.send(gameParticipantMessage)
  }

  /**
   * ゲームの状態を非アクティブにし、ゲーム中断を通知する
   * @param playerId ゲームを中断したプレイヤーid
   */
  protected gameAbort(playerId: string): void {
    this._isActive = false
    this._gameOwnerId = undefined
    this.clearParticipantIds()
    const gameAbortMessage = new ResponseGameAbortMessage({ gameId: this.gameId, playerId })
    this.store.of('networkPlugin').messageSender.send(gameAbortMessage)
  }

  /**
   * ゲームの状態を非アクティブにし、ゲーム終了を通知する
   */
  protected gameEnd(): void {
    this._isActive = false
    this._gameOwnerId = undefined
    this.clearParticipantIds()
    const gameEndMessage = new ResponseGameEndMessage({ gameId: this.gameId })
    this.store.of('networkPlugin').messageSender.send(gameEndMessage)
  }

  /**
   * ゲーム参加者のプレイヤーidリストをクリアする
   */
  private clearParticipantIds(): void {
    this._participantIds = []
  }
}
