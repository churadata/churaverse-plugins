import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'

export interface ISynchroBreakResultScreen extends IGameUiComponent {
  createResultRanking: () => void
}
