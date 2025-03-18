import { IPlayersCoinRepository } from '../interface/IPlayersCoinRepository'

/**
 * playerIdとプレイヤーの所持コイン枚数を保存する
 */
export class PlayersCoinRepository implements IPlayersCoinRepository {
  private readonly playerCoins = new Map<string, number>()

  public set(playerId: string, coinNumber: number): void {
    this.playerCoins.set(playerId, coinNumber)
  }

  public change(playerId: string, coins: number): void {
    if (this.playerCoins.has(playerId)) {
      this.playerCoins.set(playerId, coins)
    } else {
      throw new Error('playerIdがplayersCoinRepositoryに存在しません')
    }
  }

  public get(playerId: string): number | undefined {
    return this.playerCoins.get(playerId)
  }

  public delete(playerId: string): void {
    this.playerCoins.delete(playerId)
  }

  /**
   * @returns プレイヤーのコイン枚数を降順にソートした配列
   */
  public sortedPlayerCoins(): Array<{ playerId: string; coins: number }> {
    return Array.from(this.playerCoins.entries())
      .map(([playerId, coins]) => ({ playerId, coins }))
      .sort((a, b) => b.coins - a.coins)
  }
}
