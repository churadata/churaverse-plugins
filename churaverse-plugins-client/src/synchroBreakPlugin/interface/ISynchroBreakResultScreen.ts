import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'
import { ResultScreenType } from '../type/resultScreenType'

export interface ISynchroBreakResultScreen extends IGameUiComponent {
  createResultRanking: (type: ResultScreenType) => void
  close: () => void
}
