/**
 * playerIdとプレイヤーの所持コイン枚数を保存する
 */
export class PlayersCoinRepository {
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

  public getAllPlayerIds(): string[] {
    return Array.from(this.playerCoins.keys())
  }

  public reset(): void {
    const defaultPlayersCoin = 100
    this.playerCoins.forEach((_, playerId) => {
      this.playerCoins.set(playerId, defaultPlayersCoin)
    })
  }

  public get size(): number {
    return this.playerCoins.size
  }

  public get players(): string[] {
    const players: string[] = Array.from(this.playerCoins).map((value) => value[0])
    return players
  }

  public sortedPlayerCoins(): Array<{ playerId: string; coins: number }> {
    return Array.from(this.playerCoins.entries())
      .map(([playerId, coins]) => ({ playerId, coins }))
      .sort((a, b) => b.coins - a.coins)
  }

  public sortPlayerCoinsDesc(): Map<string, number> {
    const entries = Array.from(this.playerCoins.entries())

    entries.sort((a, b) => b[1] - a[1])

    return new Map(entries)
  }

  public playerOrders(): string[] {
    const entries = Array.from(this.playerCoins.entries())
    entries.sort((a, b) => b[1] - a[1])
    const playerOrders: string[] = entries.map(([playerId, _]) => playerId)
    return playerOrders
  }
}
