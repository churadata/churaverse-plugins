import { GameAbortEvent } from '../event/gameAbortEvent'
import { GameEndEvent } from '../event/gameEndEvent'
import { GameStartEvent } from '../event/gameStartEvent'
import { PriorGameDataEvent } from '../event/priorGameDataEvent'
import { UpdateGameParticipantEvent } from '../event/updateGameParticipantEvent'
import { GameIds } from '../interface/gameIds'
import { IGameInfo } from '../interface/IGameInfo'
import { GamePluginStore } from '../store/defGamePluginStore'
import { BaseGamePlugin } from './baseGamePlugin'

/**
 * BaseGamePluginを拡張したCoreなゲーム抽象クラス
 */
export abstract class CoreGamePlugin extends BaseGamePlugin implements IGameInfo {
  public abstract gameId: GameIds
  protected abstract gameName: string
  private _isActive: boolean = false
  private _gameOwnerId?: string
  private _participantIds: string[] = []
  private _isOwnPlayerMidwayParticipant: boolean = false
  protected gamePluginStore!: GamePluginStore

  public get isActive(): boolean {
    return this._isActive
  }

  public get gameOwnerId(): string | undefined {
    return this._gameOwnerId
  }

  public get participantIds(): string[] {
    return this._participantIds
  }

  public get isOwnPlayerMidwayParticipant(): boolean {
    return this._isOwnPlayerMidwayParticipant
  }

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('init', this.getStores.bind(this))
    this.bus.subscribeEvent('priorGameData', this.priorGameData.bind(this), 'HIGH')
    this.bus.subscribeEvent('gameStart', this.gameStart.bind(this), 'HIGH')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('gameAbort', this.gameAbort)
    this.bus.subscribeEvent('gameEnd', this.gameEnd)
    this.bus.subscribeEvent('updateGameParticipant', this.updateGameParticipant)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('gameAbort', this.gameAbort)
    this.bus.unsubscribeEvent('gameEnd', this.gameEnd)
    this.bus.unsubscribeEvent('updateGameParticipant', this.updateGameParticipant)
  }

  public getStores(): void {
    super.getStores()
    this.gamePluginStore = this.store.of('gamePlugin')
  }

  private priorGameData(ev: PriorGameDataEvent): void {
    this._isActive = this.gameId === ev.runningGameId
    if (!this.isActive) return
    this.gamePluginStore.gameLogRenderer.gameLog(`${this.gameName}が開始されています。`, 400)
    this._isOwnPlayerMidwayParticipant = true
  }

  protected gameStart(ev: GameStartEvent): void {
    this._isActive = this.gameId === ev.gameId
    if (!this.isActive) return
    this._gameOwnerId = ev.playerId
    this._participantIds = this.store.of('playerPlugin').players.getAllId()
    this.gamePluginStore.gameUiManager.initializeAllUis(this.gameId)
    this.gamePluginStore.gameLogRenderer.gameStartLog(this.gameName, this.gameOwnerId ?? '')
    this.gameInfoStore.games.set(this.gameId, this)
  }

  private readonly gameAbort = (ev: GameAbortEvent): void => {
    if (ev.gameId !== this.gameId) return
    this.gamePluginStore.gameLogRenderer.gameAbortLog(this.gameName, ev.playerId)
    this.terminateGame()
  }

  private readonly gameEnd = (ev: GameEndEvent): void => {
    if (ev.gameId !== this.gameId) return
    this.gamePluginStore.gameLogRenderer.gameEndLog(this.gameName)
    this.terminateGame()
  }

  private terminateGame(): void {
    this._isActive = false
    this._gameOwnerId = undefined
    this._participantIds = []
    this._isOwnPlayerMidwayParticipant = false
    this.gamePluginStore.gameUiManager.removeAllUis(this.gameId)
    this.gameInfoStore.games.delete(this.gameId)
  }

  /**
   * ゲーム参加者のidリストを受け取り、ゲーム参加者リストを更新する
   */
  private readonly updateGameParticipant = (ev: UpdateGameParticipantEvent): void => {
    if (ev.gameId !== this.gameId) return
    this._participantIds = ev.participantIds
    this.handleGameParticipant()
  }

  /**
   * ゲーム参加者が更新された際の処理を実装するための抽象メソッド
   * 各ゲームプラグインでオーバーライドし、具体的なロジックを定義する
   */
  protected abstract handleGameParticipant(): void
}
