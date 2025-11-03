import { GameIds } from './interface/gameIds'
import { GameJoinStatus } from './interface/gameJoinStatus'
import { IGameJoinManager } from './interface/IGameJoinManager'

/**
 * 各ゲームの参加プレイヤーを管理するクラス
 * - 参加可否の回答管理
 * - 途中参加プレイヤーの管理
 * - タイムアウト時の自動不参加設定
 */
export class GameJoinManager implements IGameJoinManager {
  private readonly joinStatuses = new Map<GameIds, GameJoinStatus>()

  public constructor(private readonly gameId: GameIds) {}

  public init(allPlayers: string[]): void {
    this.joinStatuses.set(this.gameId, {
      allPlayers: new Set(allPlayers),
      joinedPlayers: new Set(),
      respondedPlayers: new Set(),
    })
  }

  public set(playerId: string, willJoin: boolean): void {
    const status = this.joinStatuses.get(this.gameId)
    if (status === undefined) return
    status.respondedPlayers.add(playerId)
    if (willJoin) status.joinedPlayers.add(playerId)
  }

  public delete(playerId: string): boolean {
    const status = this.joinStatuses.get(this.gameId)
    if (status === undefined) return false
    status.allPlayers.delete(playerId)
    status.respondedPlayers.delete(playerId)
    return status.joinedPlayers.delete(playerId)
  }

  public isAllPlayersResponded(): boolean {
    const status = this.joinStatuses.get(this.gameId)
    return status?.allPlayers.size === status?.respondedPlayers.size
  }

  public getParticipantIds(): string[] {
    const status = this.joinStatuses.get(this.gameId)
    return Array.from(status?.joinedPlayers ?? [])
  }

  public clear(): void {
    this.joinStatuses.delete(this.gameId)
  }

  public timeoutResponse(): void {
    const status = this.joinStatuses.get(this.gameId)
    if (status === undefined) return
    status.allPlayers.forEach((playerId) => {
      if (status.respondedPlayers.has(playerId)) return
      status.respondedPlayers.add(playerId)
    })
  }

  public midwayJoinPlayer(playerId: string): void {
    const status = this.joinStatuses.get(this.gameId)
    if (status === undefined) return
    status.allPlayers.add(playerId)
    status.joinedPlayers.add(playerId)
    status.respondedPlayers.add(playerId)
  }
}
