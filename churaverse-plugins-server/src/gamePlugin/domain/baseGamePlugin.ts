import { BasePlugin, IMainScene, Store, IEventBus } from 'churaverse-engine-server'
import '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import '@churaverse/player-plugin-server/store/defPlayerPluginStore'
import { GameIds } from '../interface/gameIds'
import { ResponseGameStartMessage } from '../message/gameStartMessage'
import { UpdateGameParticipantMessage } from '../message/updateGameParticipantMessage'
import { ResponseGameAbortMessage } from '../message/gameAbortMessage'
import { ResponseGameEndMessage } from '../message/gameEndMessage'
import { GameAbortEvent } from '../event/gameAbortEvent'
import { GameEndEvent } from '../event/gameEndEvent'
import { PriorGameDataEvent } from '../event/priorGameDataEvent'
import { PriorGameDataMessage } from '../message/priorGameDataMessage'

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
   * ゲーム開始時に共通して登録されるイベントリスナー
   */
  protected addListenEvent(): void {
    this.bus.subscribeEvent('gameAbort', this.gameAbort)
    this.bus.subscribeEvent('gameEnd', this.gameEnd)
    this.bus.subscribeEvent('priorGameData', this.priorGameData)
  }

  /**
   * ゲームが中断・終了時に共通して削除されるイベントリスナー
   */
  protected deleteListenEvent(): void {
    this.bus.unsubscribeEvent('gameAbort', this.gameAbort)
    this.bus.unsubscribeEvent('gameEnd', this.gameEnd)
    this.bus.unsubscribeEvent('priorGameData', this.priorGameData)
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
   * ゲームが中断した時の処理
   */
  private readonly gameAbort = (ev: GameAbortEvent): void => {
    this.terminateGame()
    const gameAbortMessage = new ResponseGameAbortMessage({ gameId: this.gameId, playerId: ev.playerId })
    this.store.of('networkPlugin').messageSender.send(gameAbortMessage)
  }

  /**
   * ゲームが終了した時の処理
   */
  private readonly gameEnd = (ev: GameEndEvent): void => {
    this.terminateGame()
    const gameEndMessage = new ResponseGameEndMessage({ gameId: this.gameId })
    this.store.of('networkPlugin').messageSender.send(gameEndMessage)
  }

  /**
   * ゲームが中断・終了された時の共通処理を実行する
   * ゲームの状態を非アクティブにする
   */
  private terminateGame(): void {
    this._isActive = false
    this._gameOwnerId = undefined
    this.clearParticipantIds()
  }

  /**
   * ゲーム特有の中断・終了時の処理を実装するための抽象メソッド
   * 各ゲームプラグインでオーバーライドし、具体的なロジックを定義する
   */
  protected abstract handleGameTermination(): void

  /**
   * プレイヤーが途中参加した時の処理。ゲームが開始されている場合、メッセージを送信する
   */
  private readonly priorGameData = (ev: PriorGameDataEvent): void => {
    if (!this.isActive) return
    this.store.of('networkPlugin').messageSender.send(new PriorGameDataMessage({ runningGameId: this.gameId }))
  }

  /**
   * ゲーム参加者のプレイヤーidリストをクリアする
   */
  private clearParticipantIds(): void {
    this._participantIds = []
  }
}
