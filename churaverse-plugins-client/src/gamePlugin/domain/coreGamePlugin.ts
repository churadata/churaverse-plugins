import { EntityDespawnEvent, IMainScene } from 'churaverse-engine-client'
import { isPlayer } from '@churaverse/player-plugin-client/domain/player'
import { NetworkPluginStore } from '@churaverse/network-plugin-client/store/defNetworkPluginStore'
import { GameAbortEvent } from '../event/gameAbortEvent'
import { GameEndEvent } from '../event/gameEndEvent'
import { GameStartEvent } from '../event/gameStartEvent'
import { PriorGameDataEvent } from '../event/priorGameDataEvent'
import { GameIds } from '../interface/gameIds'
import { IGameInfo } from '../interface/IGameInfo'
import { GamePluginStore } from '../store/defGamePluginStore'
import { BaseGamePlugin } from './baseGamePlugin'
import { GamePlayerQuitEvent } from '../event/gamePlayerQuitEvent'
import { GamePlayerQuitMessage } from '../message/gamePlayerQuitMessage'

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
  private networkPluginStore!: NetworkPluginStore<IMainScene>

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
    this.bus.subscribeEvent('gamePlayerQuit', this.onPlayerQuitGame)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('gameAbort', this.gameAbort)
    this.bus.unsubscribeEvent('gameEnd', this.gameEnd)
    this.bus.unsubscribeEvent('entityDespawn', this.onPlayerLeave)
    this.bus.unsubscribeEvent('gamePlayerQuit', this.onPlayerQuitGame)
  }

  public getStores(): void {
    super.getStores()
    this.gamePluginStore = this.store.of('gamePlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
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
   * プレイヤーがちゅらバースから退出した時の処理
   * @param playerId 退出したプレイヤーのID
   */
  protected abstract handlePlayerLeave(playerId: string): void

  private readonly onPlayerQuitGame = (ev: GamePlayerQuitEvent): void => {
    if (!this.removeParticipant(ev.playerId)) return
    const gamePlayerQuitMessage = new GamePlayerQuitMessage({ gameId: ev.gameId, playerId: ev.playerId })
    this.networkPluginStore.messageSender.send(gamePlayerQuitMessage)
    this.handlePlayerQuitGame(ev.playerId)
  }

  /**
   * プレイヤーが参加中のゲームから離脱した時の処理
   * @param playerId ゲームから離脱したプレイヤーのID
   */
  protected abstract handlePlayerQuitGame(playerId: string): void

  /**
   * 退出したプレイヤーがゲーム参加者の場合、参加者リストから削除しtrueを返す
   */
  private removeParticipant(playerId: string): boolean {
    const idx = this._participantIds.indexOf(playerId)
    if (idx === -1) return false
    this._participantIds.splice(idx, 1)
    return true
  }
}
