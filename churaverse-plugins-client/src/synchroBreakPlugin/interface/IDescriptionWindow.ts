import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'

export interface IDescriptionWindow extends IGameUiComponent {
  setDescriptionText: (text: string) => void
}
