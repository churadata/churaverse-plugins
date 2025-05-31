import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'

export interface IDescriptionText extends IGameUiComponent {
  open: () => void
  setGameBaseInfo: (gameName: string, ownerName: string) => void
  setGameStartForHost: () => void
  setGameStartForGuest: () => void
  setTurnSelectionForOwner: (turn: number) => void
  setTurnSelectionForGuest: (turn: number) => void
  setTimeLimitSelectionForOwner: (timeLimit: string) => void
  setTimeLimitSelectionForGuest: (timeLimit: string) => void
  setBetCoinSelection: (betCoin: number) => void
  setGameStartCountdown: (countdown: number) => void
  setSynchroBreakStart: (timeLimit: number) => void
  setSynchroBreakInProgress: (countdown: number, player?: string, nyokkiSuccessMessage?: string) => void
  setSynchroBreakEnd: () => void
  setTurnStart: (turnNumber: number) => void
  setNyokkiAction: (text: string) => void
}
