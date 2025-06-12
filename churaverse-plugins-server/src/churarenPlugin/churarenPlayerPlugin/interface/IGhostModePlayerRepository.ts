import { Player } from '@churaverse/player-plugin-server/domain/player'

export interface IGhostModePlayerRepository {
  set: (playerId: string, entity: Player) => void
  has: (playerId: string) => boolean
  delete: (playerId: string) => void
  clear: () => void
  getAllId: () => string[]
  getRandomPlayerId: () => string
}
