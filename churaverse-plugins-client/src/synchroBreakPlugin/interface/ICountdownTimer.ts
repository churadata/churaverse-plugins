import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'

export interface ICountdownTimer extends IGameUiComponent {
  setTimeLimit: (time: number) => void
  getNyokkiStatus: (status: boolean, nyokkiLogText: string) => void
}
