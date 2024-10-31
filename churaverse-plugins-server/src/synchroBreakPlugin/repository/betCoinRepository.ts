export class BetCoinRepository {
  private readonly playerBetCoins = new Map<string, number>()

  public set(id: string, coinNumber: number): void {
    this.playerBetCoins.set(id, coinNumber)
  }

  public get(id: string): number | undefined {
    return this.playerBetCoins.get(id)
  }

  public delete(id: string): void {
    this.playerBetCoins.delete(id)
  }

  // clear()を呼び出せるようにnyokkiGameEndEventを作成する
  public clear(): void {
    this.playerBetCoins.clear()
  }

  public calculateMultiplier(betCoins: number, totalPlayerNum: number, playerOrder: number): number {
    // playerOrderが-1ということはnyokkiしていないことを意味するため、増加分はなし
    if (playerOrder === -1) return 0

    const calculatedCoinsNumber = betCoins * (totalPlayerNum - playerOrder)
    return calculatedCoinsNumber
  }

  public getPlayersBetCoinArray(): Array<[string, number]> {
    const playerBetCoinArray = Array.from(this.playerBetCoins)
    return playerBetCoinArray
  }
}
