import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'

export interface IBetCoinFormContainer extends IGameUiComponent {
  postBetCoinOnTimeout: (ownPlayerId: string) => void
  open: () => void
  close: () => void
}
