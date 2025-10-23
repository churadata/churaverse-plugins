import { GameIds } from './gameIds'

export interface IGameSelectionListItemRenderer {
  onGameHost: (gameId: GameIds) => void
  onGameStart: (gameId: GameIds) => void
  resetStartButton: () => void
}
