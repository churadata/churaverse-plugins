import { BaseGamePlugin } from '../domain/baseGamePlugin'
import { GameIds } from '../interface/gameIds'

export class GameRepository {
  private readonly games = new Map<GameIds, BaseGamePlugin>()

  public set(id: GameIds, entity: BaseGamePlugin): void {
    this.games.set(id, entity)
  }

  public delete(id: GameIds): void {
    this.games.delete(id)
  }

  public has(id: GameIds): boolean {
    return this.games.has(id)
  }

  public get(id: GameIds): BaseGamePlugin | undefined {
    return this.games.get(id)
  }

  public getAllId(): GameIds[] {
    return Array.from(this.games.keys())
  }
}
