export interface IPlayersCoinRepository {
  set: (playerId: string, coins: number) => void
  change: (playerId: string, coins: number) => void
  delete: (playerId: string) => void
  getPlayersSortedByCoins: () => Array<{ playerId: string; coins: number }>
}
