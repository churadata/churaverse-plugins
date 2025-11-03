import { GameState } from '../type/gameState'
import { GameIds } from './gameIds'
import { GamePolicy } from './gamePolicy'

/**
 * ゲームのメタ情報
 */
export interface IGameInfo {
  readonly gameId: GameIds
  readonly isActive: boolean
  readonly isJoined: boolean
  readonly gameOwnerId: string | undefined
  readonly participantIds: string[]
  readonly gameState: GameState
  readonly gamePolicy: GamePolicy
}
