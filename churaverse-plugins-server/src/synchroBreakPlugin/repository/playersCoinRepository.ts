/**
 * playerIdとプレイヤーの所持コイン枚数を保存する
 */
export class PlayersCoinRepository {
  private readonly playerCoins = new Map<string, number>()

  public set(id: string, coinNumber: number): void {
    this.playerCoins.set(id, coinNumber)
  }

  public get(id: string): number | undefined {
    return this.playerCoins.get(id)
  }

  public delete(id: string): void {
    this.playerCoins.delete(id)
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

  public sortedPlayerCoins(): Array<[string, number]> {
    const sortedCoins = Array.from(this.playerCoins.entries()).sort((a, b) => {
      const coinA = a[1]
      const coinB = b[1]
      return coinB - coinA
    })

    return sortedCoins
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
