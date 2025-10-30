import { GameState } from '../type/gameState'
import { GameIds } from './gameIds'

export interface IGameSelectionListItemRenderer {
  onPriorGameData: (gameId: GameIds, gameState: GameState) => void
  onGameHost: (gameId: GameIds) => void
  onGameStart: (gameId: GameIds, isJoin: boolean) => void
  resetStartButton: () => void
}
