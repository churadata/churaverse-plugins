import { IPlayersCoinRepository } from '../interface/IPlayersCoinRepository'

export class PlayersCoinRepository implements IPlayersCoinRepository {
  private readonly playerCoins = new Map<string, number>()

  public set(playerId: string, coins: number): void {
    this.playerCoins.set(playerId, coins)
  }

  public get(playerId: string): number {
    const coins = this.playerCoins.get(playerId)
    if (coins === undefined) {
      throw new Error('playerIdがplayersCoinRepositoryに存在しません')
    }
    return coins
  }

  public change(playerId: string, coins: number): void {
    if (this.playerCoins.has(playerId)) {
      this.playerCoins.set(playerId, coins)
    } else {
      throw new Error('playerIdがplayersCoinRepositoryに存在しません')
    }
  }

  public delete(playerId: string): void {
    this.playerCoins.delete(playerId)
  }

  public getPlayersSortedByCoins(): Array<{ playerId: string; coins: number }> {
    return Array.from(this.playerCoins.entries())
      .map(([playerId, coins]) => ({ playerId, coins }))
      .sort((a, b) => b.coins - a.coins)
  }
}
