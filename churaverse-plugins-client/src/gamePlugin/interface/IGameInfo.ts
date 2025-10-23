import { GameIds } from './gameIds'

/**
 * ゲームのメタ情報
 */
export interface IGameInfo {
  readonly gameId: GameIds
  readonly isActive: boolean
  readonly isJoinGame: boolean
  readonly gameOwnerId: string | undefined
  readonly participantIds: string[]
  readonly isOwnPlayerMidwayParticipant: boolean
}
