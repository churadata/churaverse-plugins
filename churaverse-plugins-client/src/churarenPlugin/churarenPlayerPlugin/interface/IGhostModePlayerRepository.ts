import { Player } from '@churaverse/player-plugin-client/domain/player'

export interface IGhostModePlayerRepository {
  set: (playerId: string, entity: Player) => void
  has: (playerId: string) => boolean
  delete: (playerId: string) => void
  getAllId: () => string[]
  getPlayerNames: () => string[]
  size: number
}
