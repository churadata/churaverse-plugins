export interface IReadyPlayerRepository {
  set: (playerId: string) => void
  delete: (playerId: string) => void
  length: () => number
  isExists: (playerId: string) => boolean
  getAllId: () => string[]
  clear: () => void
}
