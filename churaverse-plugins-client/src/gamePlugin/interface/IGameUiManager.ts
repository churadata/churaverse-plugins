import { GameIds } from './gameIds'
import { GameUiName, GameUiMap } from '../gameUiManager'

export interface IGameUiManager {
  initializeAllUis: (gameId: GameIds) => void
  getUi: <K extends GameUiName>(gameId: GameIds, uiName: K) => GameUiMap[GameIds][K] | undefined
  removeAllUis: (gameId: GameIds) => void
}
