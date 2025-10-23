import { EntityDespawnEvent } from 'churaverse-engine-server'
import '@churaverse/player-plugin-server/store/defPlayerPluginStore'
import '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { isPlayer } from '@churaverse/player-plugin-server/domain/player'
import { GameAbortEvent } from '../event/gameAbortEvent'
import { GameEndEvent } from '../event/gameEndEvent'
import { GameStartEvent } from '../event/gameStartEvent'
import { PriorGameDataEvent } from '../event/priorGameDataEvent'
import { GameIds } from '../interface/gameIds'
import { IGameInfo } from '../interface/IGameInfo'
import { ResponseGameAbortMessage } from '../message/gameAbortMessage'
import { ResponseGameEndMessage } from '../message/gameEndMessage'
import { ResponseGameStartMessage } from '../message/gameStartMessage'
import { PriorGameDataMessage } from '../message/priorGameDataMessage'
import { BaseGamePlugin } from './baseGamePlugin'
import { GamePlayerQuitEvent } from '../event/gamePlayerQuitEvent'
import { GameHostEvent } from '../event/gameHostEvent'
import { ResponseGameHostMessage } from '../message/gameHostMessage'

/**
 * BaseGamePluginを拡張したCoreなゲーム抽象クラス
 */
export abstract class CoreGamePlugin extends BaseGamePlugin implements IGameInfo {
  public abstract gameId: GameIds
  private _isActive: boolean = false
  private _gameOwnerId?: string
  private _participantIds: string[] = []

  public get isActive(): boolean {
    return this._isActive
  }

  public get gameOwnerId(): string | undefined {
    return this._gameOwnerId
  }

  public get participantIds(): string[] {
    return this._participantIds
  }

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('gameStart', this.gameStart.bind(this), 'HIGH')
    this.bus.subscribeEvent('priorGameData', this.priorGameData.bind(this))
    this.bus.subscribeEvent('gameHost', this.gameHost.bind(this))
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

  private priorGameData(ev: PriorGameDataEvent): void {
    if (!this.isActive) return
    this.store
      .of('networkPlugin')
      .messageSender.send(new PriorGameDataMessage({ runningGameId: this.gameId }), ev.senderId)
  }

  private gameHost(ev: GameHostEvent): void {
    this._isActive = this.gameId === ev.gameId
    if (!this.isActive) return
    this._gameOwnerId = ev.ownerId
    const timeoutSec = 30
    const responseGameHostMessage = new ResponseGameHostMessage({
      gameId: this.gameId,
      ownerId: this.gameOwnerId ?? '',
      timeoutSec,
    })
    this.store.of('networkPlugin').messageSender.send(responseGameHostMessage)
  }

  private gameStart(ev: GameStartEvent): void {
    this._isActive = this.gameId === ev.gameId
    if (!this.isActive) return
    this._gameOwnerId = ev.playerId
    this._participantIds = this.store.of('playerPlugin').players.getAllId()

    const gameStartMessage = new ResponseGameStartMessage({
      gameId: this.gameId,
      playerId: ev.playerId,
      participantIds: this._participantIds,
    })
    this.store.of('networkPlugin').messageSender.send(gameStartMessage)

    this.gamePluginStore.games.set(this.gameId, this)
  }

  private readonly gameAbort = (ev: GameAbortEvent): void => {
    if (ev.gameId !== this.gameId) return
    const gameAbortMessage = new ResponseGameAbortMessage({ gameId: this.gameId, playerId: ev.playerId })
    this.store.of('networkPlugin').messageSender.send(gameAbortMessage)
    this.terminateGame()
  }

  private readonly gameEnd = (ev: GameEndEvent): void => {
    if (ev.gameId !== this.gameId) return
    const gameEndMessage = new ResponseGameEndMessage({ gameId: this.gameId })
    this.store.of('networkPlugin').messageSender.send(gameEndMessage)
    this.terminateGame()
  }

  private terminateGame(): void {
    this._isActive = false
    this._gameOwnerId = undefined
    this._participantIds = []
    this.gamePluginStore.games.delete(this.gameId)
  }

  /**
   * ちゅらバースから退出したプレイヤーがゲーム参加者の場合、参加者リストから削除しtrueを返す
   */
  private readonly onPlayerLeave = (ev: EntityDespawnEvent): void => {
    if (isPlayer(ev.entity) === false) return
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
