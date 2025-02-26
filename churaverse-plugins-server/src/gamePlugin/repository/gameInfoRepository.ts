import { GameIds } from '../interface/gameIds'
import { IGameInfo } from '../interface/IGameInfo'
import { IGameInfoRepository } from '../interface/IGameInfoRepository'

/**
 * 各ゲームのメタ情報を管理するリポジトリ
 */
export class GameInfoRepository<T extends IGameInfo> implements IGameInfoRepository<T> {
  private readonly games = new Map<GameIds, T>()

  public set(id: GameIds, entity: T): void {
    this.games.set(id, entity)
  }

  public delete(id: GameIds): void {
    this.games.delete(id)
  }

  public get(id: GameIds): T | undefined {
    return this.games.get(id)
  }

  public getAllId(): GameIds[] {
    return Array.from(this.games.keys())
  }
}
