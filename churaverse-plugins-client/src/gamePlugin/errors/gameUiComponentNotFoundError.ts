import { GamePluginError } from './gamePluginError'
import { GameIds } from '../interface/gameIds'

export class GameUiComponentNotFoundError extends GamePluginError {
  public constructor(gameId: GameIds) {
    super(`GameId: ${gameId} に対応するUIコンポーネントが見つかりません`)
  }
}
