import { GameIds } from './gameIds'

export interface IGameLogRenderer {
  gameStartLog: (gameId: GameIds, playerId: string) => void
  gameMidwayJoinLog: (gameId: GameIds) => void
  gameEndLog: (gameId: GameIds) => void
  gameAbortLog: (gameId: GameIds, playerId: string) => void
}
