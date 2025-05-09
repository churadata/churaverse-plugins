import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'

export interface IDescriptionText extends IGameUiComponent {
  open: () => void
  setGameName: (name: string) => void
  setGameOwnerName: (name: string) => void
  setDescriptionText: (text: string) => void
  setGameStartForHost: () => void
  setGameStartForGuest: () => void
  setTimeLimitSelection: (turn: number) => void
  setTimeLimitWaiting: (turn: number) => void
  setTimeLimitConfirmed: (timeLimit: string) => void
  setTimeLimitAcknowledged: (timeLimit: string) => void
  setBetCoinSelection: (betCoin: number) => void
  setGameStartCountdown: (countdown: number) => void
  setSynchroBreakStart: (timeLimit: number) => void
  setSynchroBreakInProgress: (countdown: number, player?: string, nyokkiSuccessMessage?: string) => void
  setSynchroBreakEnd: () => void
  setTurnStart: (turnNumber: number) => void
  setNyokkiAction: (text: string) => void
}
