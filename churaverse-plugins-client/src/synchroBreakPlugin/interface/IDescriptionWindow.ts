import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'

export interface IDescriptionWindow extends IGameUiComponent {
  setGameBaseInfo: (gameName: string, ownerName: string) => void
  displayGameStartForOwner: () => void
  displayGameStartForGuest: () => void
  displayTurnSelectionForOwner: (turn: number) => void
  displayTurnSelectionForGuest: (turn: number) => void
  displayTimeLimitSelectionForOwner: (timeLimit: string) => void
  displayTimeLimitSelectionForGuest: (timeLimit: string) => void
  displayBetCoinSelection: (betCoin: number) => void
  displayGameStartCountdown: (countdown: number) => void
  displaySynchroBreakStart: (timeLimit: number) => void
  displaySynchroBreakInProgress: (countdown: number, player?: string, nyokkiSuccessMessage?: string) => void
  displaySynchroBreakEnd: () => void
  displayTurnStart: (turnNumber: number) => void
  displayNyokkiAction: (text: string) => void
  displayResultMessage: () => void
}
