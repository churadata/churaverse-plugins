export interface IBetCoinRepository {
  set: (playerId: string, betCoin: number) => void
  get: (playerId: string) => number | undefined
  delete: (playerId: string) => void
  clear: () => void
  getBetCoinPlayerCount: () => number
}
