import { GameIds } from './gameIds'

export interface IGameListItemRenderer {
  onGameStart: (gameId: GameIds) => void
  resetStartButton: () => void
}
