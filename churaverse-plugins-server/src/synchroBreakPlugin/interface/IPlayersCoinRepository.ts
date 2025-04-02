export interface IPlayersCoinRepository {
  set: (playerId: string, coins: number) => void
  get: (playerId: string) => number | undefined
  change: (playerId: string, coins: number) => void
  delete: (playerId: string) => void
  sortedPlayerCoins: () => Array<{ playerId: string; coins: number }>
}
