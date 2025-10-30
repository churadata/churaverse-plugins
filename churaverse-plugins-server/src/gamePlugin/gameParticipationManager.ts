import { GameIds } from './interface/gameIds'
import { GameParticipationPlayers } from './interface/gameParticipationPlayers'
import { IGameParticipationManager } from './interface/IGameParticipatioinManager'

/**
 * 各ゲームの参加プレイヤーを管理するクラス
 */
export class GameParticipationManager implements IGameParticipationManager {
  private readonly gameParticipation = new Map<GameIds, GameParticipationPlayers>()

  public constructor(private readonly gameId: GameIds) {}

  public init(allPlayers: string[]): void {
    this.gameParticipation.set(this.gameId, {
      allPlayers: new Set(allPlayers),
      joinedPlayers: new Set(),
      respondedPlayers: new Set(),
    })
  }

  public set(playerId: string, isJoin: boolean): void {
    const game = this.gameParticipation.get(this.gameId)
    if (game === undefined) return
    game.respondedPlayers.add(playerId)
    if (isJoin) game.joinedPlayers.add(playerId)
  }

  public delete(playerId: string): boolean {
    const game = this.gameParticipation.get(this.gameId)
    if (game === undefined) return false
    game.allPlayers.delete(playerId)
    game.respondedPlayers.delete(playerId)
    return game.joinedPlayers.delete(playerId)
  }

  public isAllPlayersResponded(): boolean {
    const game = this.gameParticipation.get(this.gameId)
    return game?.allPlayers.size === game?.respondedPlayers.size
  }

  public getJoinPlayers(): string[] {
    const game = this.gameParticipation.get(this.gameId)
    return Array.from(game?.joinedPlayers ?? [])
  }

  public clear(): void {
    this.gameParticipation.delete(this.gameId)
  }

  public timeoutResponse(): void {
    const game = this.gameParticipation.get(this.gameId)
    if (game === undefined) return
    game.allPlayers.forEach((playerId) => {
      if (game.respondedPlayers.has(playerId)) return
      game.respondedPlayers.add(playerId)
    })
  }

  public midwayJoinPlayer(playerId: string): void {
    const game = this.gameParticipation.get(this.gameId)
    if (game === undefined) return
    game.allPlayers.add(playerId)
    game.joinedPlayers.add(playerId)
    game.respondedPlayers.add(playerId)
  }
}
