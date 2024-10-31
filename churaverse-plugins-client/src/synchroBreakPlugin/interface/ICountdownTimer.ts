import { IGameUi } from './IGameUi'

export interface ICountdownTimer extends IGameUi {
  setTimeLimit: (time: number) => void
  getNyokkiStatus: (status: boolean, nyokkiLogText: string) => void
}
