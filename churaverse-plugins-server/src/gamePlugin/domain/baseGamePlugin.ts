import { BasePlugin, IMainScene, Store, IEventBus } from 'churaverse-engine-server'
import '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import '@churaverse/player-plugin-server/store/defPlayerPluginStore'
import { GameIds } from '../interface/gameIds'
import { ResponseGameStartMessage } from '../message/gameStartMessage'
import { UpdateGameParticipantMessage } from '../message/updateGameParticipantMessage'
import { ResponseGameAbortMessage } from '../message/gameAbortMessage'
import { ResponseGameEndMessage } from '../message/gameEndMessage'
import { GameStartEvent } from '../event/gameStartEvent'
import { GameAbortEvent } from '../event/gameAbortEvent'
import { GameEndEvent } from '../event/gameEndEvent'
import { PriorGameDataEvent } from '../event/priorGameDataEvent'
import { PriorGameDataMessage } from '../message/priorGameDataMessage'
import { IGameInfo } from '../interface/IGameInfo'
import { GamePluginStore } from '../store/defGamePluginStore'

export abstract class BaseGamePlugin extends BasePlugin<IMainScene> implements IGameInfo {
  /** ゲーム一意のid */
  public abstract readonly gameId: GameIds
  /** ゲームの状態を保存する変数 */
  private _isActive: boolean
  /** ゲームを開始したプレイヤーid */
  private _gameOwnerId: string | undefined
  /** ゲーム参加者のプレイヤーid */
  private _participantIds: string[]

  private gamePluginStore!: GamePluginStore

  public constructor(store: Store<IMainScene>, bus: IEventBus<IMainScene>) {
    super(store, bus)
    this._isActive = false
    this._participantIds = []
  }

  /**
   * ゲームの状態を取得する
   */
  public get isActive(): boolean {
    return this._isActive
  }

  /**
   * ゲームを開始したプレイヤーidを取得する
   */
  public get gameOwnerId(): string | undefined {
    return this._gameOwnerId
  }

  /**
   * ゲーム参加者のプレイヤーidリストを取得する
   */
  public get participantIds(): string[] {
    return this._participantIds
  }

  public listenEvent(): void {
    this.bus.subscribeEvent('gameStart', this.gameStart.bind(this))
  }

  /**
   * ゲーム開始時に共通して登録されるイベントリスナー
   */
  protected subscribeGameEvent(): void {
    this.bus.subscribeEvent('gameAbort', this.gameAbort)
    this.bus.subscribeEvent('gameEnd', this.gameEnd)
    this.bus.subscribeEvent('priorGameData', this.priorGameData)
  }

  /**
   * ゲームが中断・終了時に共通して削除されるイベントリスナー
   */
  protected unsubscribeGameEvent(): void {
    this.bus.unsubscribeEvent('gameAbort', this.gameAbort)
    this.bus.unsubscribeEvent('gameEnd', this.gameEnd)
    this.bus.unsubscribeEvent('priorGameData', this.priorGameData)
  }

  /**
   * ゲームが開始した時の処理
   */
  private gameStart(ev: GameStartEvent): void {
    if (ev.gameId !== this.gameId || this.isActive) return
    this._isActive = true
    const gameOwnerId = ev.playerId
    this._gameOwnerId = gameOwnerId
    const participantIds = this.store.of('playerPlugin').players.getAllId()
    this._participantIds = participantIds
    const responseGameStartMessage = new ResponseGameStartMessage({ gameId: this.gameId, playerId: gameOwnerId })
    const networkPluginStore = this.store.of('networkPlugin')
    networkPluginStore.messageSender.send(responseGameStartMessage)
    const gameParticipantMessage = new UpdateGameParticipantMessage({ gameId: this.gameId, participantIds })
    networkPluginStore.messageSender.send(gameParticipantMessage)
    this.gamePluginStore = this.store.of('gamePlugin')
    this.gamePluginStore.games.set(this.gameId, this)
    this.handleGameStart()
  }

  /**
   * ゲーム特有の開始時の処理を実装するための抽象メソッド
   * 各ゲームプラグインでオーバーライドし、具体的なロジックを定義する
   */
  protected abstract handleGameStart(): void

  /**
   * ゲームが中断した時の処理
   */
  private readonly gameAbort = (ev: GameAbortEvent): void => {
    if (ev.gameId !== this.gameId) return
    this.terminateGame()
    const gameAbortMessage = new ResponseGameAbortMessage({ gameId: this.gameId, playerId: ev.playerId })
    this.store.of('networkPlugin').messageSender.send(gameAbortMessage)
  }

  /**
   * ゲームが終了した時の処理
   */
  private readonly gameEnd = (ev: GameEndEvent): void => {
    if (ev.gameId !== this.gameId) return
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
    this.handleGameTermination()
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
    this.store
      .of('networkPlugin')
      .messageSender.send(new PriorGameDataMessage({ runningGameId: this.gameId }), ev.senderId)
  }

  /**
   * ゲーム参加者のプレイヤーidリストをクリアする
   */
  private clearParticipantIds(): void {
    this._participantIds = []
  }
}
