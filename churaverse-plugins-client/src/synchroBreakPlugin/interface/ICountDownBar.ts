import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'

export interface ICountDownBar extends IGameUiComponent {
  updateDashOffset: (remainingSeconds: number) => void
  remove: () => void
  initialize: () => void
}
