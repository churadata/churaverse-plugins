import { EntityDespawnEvent } from 'churaverse-engine-client'
import { isPlayer } from '@churaverse/player-plugin-client/domain/player'
import { GameAbortEvent } from '../event/gameAbortEvent'
import { GameEndEvent } from '../event/gameEndEvent'
import { GameStartEvent } from '../event/gameStartEvent'
import { PriorGameDataEvent } from '../event/priorGameDataEvent'
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
    this.bus.subscribeEvent('entityDespawn', this.onPlayerLeave)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('gameAbort', this.gameAbort)
    this.bus.unsubscribeEvent('gameEnd', this.gameEnd)
    this.bus.unsubscribeEvent('entityDespawn', this.onPlayerLeave)
  }

  public getStores(): void {
    this.gamePluginStore = this.store.of('gamePlugin')
  }

  private priorGameData(ev: PriorGameDataEvent): void {
    this._isActive = this.gameId === ev.runningGameId
    if (!this.isActive) return
    this.gamePluginStore.gameLogRenderer.gameLog(`${this.gameName}が開始されています。`, 400)
    this._isOwnPlayerMidwayParticipant = true
    this.gameInfoStore.games.set(this.gameId, this)
  }

  protected gameStart(ev: GameStartEvent): void {
    this._isActive = this.gameId === ev.gameId
    if (!this.isActive) return
    this._gameOwnerId = ev.playerId
    this._participantIds = ev.participantIds
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
    this.gameInfoStore.games.delete(this.gameId)

    if (this.isOwnPlayerMidwayParticipant) {
      this._isOwnPlayerMidwayParticipant = false
    } else {
      this.gamePluginStore.gameUiManager.removeAllUis(this.gameId)
    }
  }

  private readonly onPlayerLeave = (ev: EntityDespawnEvent): void => {
    if (!isPlayer(ev.entity)) return
    const playerId: string = ev.entity.id
    if (!this.removeParticipant(playerId)) return
    this.handlePlayerLeave(playerId)
  }

  /**
   * 退出したプレイヤーがゲーム参加者の場合、参加者リストから削除しtrueを返す
   */
  private removeParticipant(playerId: string): boolean {
    const idx = this._participantIds.indexOf(playerId)
    if (idx === -1) return false
    this._participantIds.splice(idx, 1)
    return true
  }

  /**
   * プレイヤーがゲームから離脱した時の処理
   * @param playerId 離脱したプレイヤーのID
   */
  protected abstract handlePlayerLeave(playerId: string): void
}
