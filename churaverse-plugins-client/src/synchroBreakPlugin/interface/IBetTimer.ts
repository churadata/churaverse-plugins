import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'

export interface IBetTimer extends IGameUiComponent {
  updateTimer: (remainingTime: number) => void
  open: () => void
  close: () => void
}
