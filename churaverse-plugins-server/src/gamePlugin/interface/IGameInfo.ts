import { GameState } from '../type/gameState'
import { GameIds } from './gameIds'

/**
 * ゲームのメタ情報
 */
export interface IGameInfo {
  readonly gameId: GameIds
  readonly isActive: boolean
  readonly gameOwnerId: string | undefined
  readonly participantIds: string[]
  readonly gameState: GameState
}
