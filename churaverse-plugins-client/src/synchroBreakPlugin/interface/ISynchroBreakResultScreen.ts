import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'

export interface ISynchroBreakResultScreen extends IGameUiComponent {
  createFinalResultRanking: () => void
  createMiddleResultRanking: () => void
  close: () => void
}
