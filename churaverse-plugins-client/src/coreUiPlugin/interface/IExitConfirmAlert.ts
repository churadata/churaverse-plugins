export interface IExitConfirmAlert {
  setGameOwnerExitMessage: (gameName?: string) => void
  setGameExitMessage: (gameName?: string) => void
  resetGameExitMessage: () => void
}
