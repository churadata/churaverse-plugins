import { GameIds } from '../interface/gameIds'
import { BaseGamePlugin } from '../domain/baseGamePlugin'

export class GameRepository {
  private readonly games = new Map<GameIds, BaseGamePlugin>()

  public set(gameId: GameIds, game: BaseGamePlugin): void {
    this.games.set(gameId, game)
  }

  public delete(gameId: GameIds): void {
    this.games.delete(gameId)
  }

  public has(gameId: GameIds): boolean {
    return this.games.has(gameId)
  }

  public get(gameId: GameIds): BaseGamePlugin | undefined {
    return this.games.get(gameId)
  }

  public getAllId(): GameIds[] {
    return Array.from(this.games.keys())
  }
}
