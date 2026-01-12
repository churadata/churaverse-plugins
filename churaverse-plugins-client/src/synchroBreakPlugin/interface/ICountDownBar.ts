import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'

export interface ICountDownBar extends IGameUiComponent {
  setTotalDuration: (duration: number) => void
  updateDashOffset: (remainingSeconds: number) => void
  reset: () => void
  remove: () => void
  initialize: () => void
  open: () => void
  close: () => void
}
