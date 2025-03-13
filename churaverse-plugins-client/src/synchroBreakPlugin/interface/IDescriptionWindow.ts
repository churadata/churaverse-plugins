import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'

export interface IDescriptionWindow extends IGameUiComponent {
  open: (text: string) => void
  setDescriptionText: (text: string) => void
  setGameStartForHost: (gameName: string) => void
  setGameStartForGuest: (gameName: string, gameOwnerName: string | undefined) => void
  setTimeLimitSelection: (turn: number) => void
  setTimeLimitWaiting: (turn: number, gameOwnerName: string | undefined) => void
  setTimeLimitConfirmed: (timeLimit: string) => void
  setTimeLimitAcknowledged: (timeLimit: string) => void
  setBetCoinSelection: (betCoin: number) => void
  setGameStartCountdown: (countdown: number) => void
  setSynchroBreakStart: (timeLimit: number) => void
  setSynchroBreakInProgress: (
    countdown: number,
    player: string | undefined,
    nyokkiSuccessMessage: string | undefined
  ) => void
  setSynchroBreakEnd: () => void
  setTurnStart: (turnNumber: number) => void
  setNyokkiSuccess: (text: string) => void
}
