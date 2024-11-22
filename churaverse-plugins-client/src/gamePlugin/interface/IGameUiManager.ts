import { GameIds } from './gameIds'
import { GameUiName, CompleteGameUiMap } from '../gameUiManager'

export interface IGameUiManager {
  initializeAllUis: (gameId: GameIds) => void
  getUi: <K extends GameUiName>(gameId: GameIds, uiName: K) => CompleteGameUiMap[K] | undefined
  removeAllUis: (gameId: GameIds) => void
}
