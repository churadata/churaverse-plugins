import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'

export interface INyokkiResultScreen extends IGameUiComponent {
  createResultRanking: () => void
}
