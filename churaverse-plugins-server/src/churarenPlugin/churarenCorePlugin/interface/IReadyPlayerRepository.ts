export interface IReadyPlayerRepository {
  set: (playerId: string) => void
  delete: (playerId: string) => void
  has: (playerId: string) => boolean
  getAllId: () => string[]
  clear: () => void
  size: number
}
