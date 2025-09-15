import { GameIds } from './gameIds'

export interface IGameSelectionListItemRenderer {
  onGameStart: (gameId: GameIds) => void
  resetStartButton: () => void
}
