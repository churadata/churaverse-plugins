import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'

export interface IDescriptionWindow extends IGameUiComponent {
  open: (text: string) => void
  setDescriptionText: (text: string) => void
}
