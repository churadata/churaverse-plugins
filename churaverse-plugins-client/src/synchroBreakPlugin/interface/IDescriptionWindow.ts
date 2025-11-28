import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'
import { ICountDownBar } from './ICountDownBar'

export interface IDescriptionWindow extends IGameUiComponent {
  setGameBaseInfo: (gameName: string, ownerName: string) => void
  displayCountDownBar: (countDownBar: ICountDownBar) => void
  displayGameStartForOwner: () => void
  displayGameStartForGuest: () => void
  displayTurnSelectionForOwner: (turn: number) => void
  displayTurnSelectionForGuest: (turn: number) => void
  displayTimeLimitSelectionForOwner: (timeLimit: string, ownCoins: number) => void
  displayTimeLimitSelectionForGuest: (timeLimit: string, ownCoins: number) => void
  displayBetCoinSelection: (betCoin: number) => void
  displayGameStartCountdown: (countdown: number) => void
  displaySynchroBreakStart: (timeLimit: number) => void
  displaySynchroBreakInProgress: (countdown: number, player?: string, nyokkiSuccessMessage?: string) => void
  displaySynchroBreakEnd: () => void
  displayTurnStart: (turnNumber: number, ownCoins: number) => void
  displayNyokkiAction: (text: string) => void
  displayResultMessage: () => void
  close: () => void
}
