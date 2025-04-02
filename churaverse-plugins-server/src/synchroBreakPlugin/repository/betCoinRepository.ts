import { IBetCoinRepository } from '../interface/IBetCoinRepository'

/**
 * ベットしたコインを管理するリポジトリ
 */
export class BetCoinRepository implements IBetCoinRepository {
  private readonly playerBetCoins = new Map<string, number>()

  public set(playerId: string, betCoin: number): void {
    this.playerBetCoins.set(playerId, betCoin)
  }

  public get(playerId: string): number | undefined {
    return this.playerBetCoins.get(playerId)
  }

  public delete(playerId: string): void {
    this.playerBetCoins.delete(playerId)
  }

  public clear(): void {
    this.playerBetCoins.clear()
  }

  /**
   * ベットコインを入力したプレイヤーの数を取得する
   */
  public getBetCoinPlayerCount(): number {
    return this.playerBetCoins.size
  }

  /**
   * ニョッキ成功時のコイン増加量を計算する
   * @param betCoins ベットしたコイン数
   * @param totalPlayerNum 全プレイヤー数
   * @param playerOrder ニョッキしたプレイヤーの順位
   */
  public calculateMultiplier(betCoins: number, totalPlayerNum: number, playerOrder: number): number {
    // playerOrderが-1ということはnyokkiしていないことを意味するため、増加分はなし
    if (playerOrder === -1) return 0

    const calculatedCoinsNumber = betCoins * (totalPlayerNum - playerOrder)
    return calculatedCoinsNumber
  }
}
