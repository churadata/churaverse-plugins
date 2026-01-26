import { IDialog } from '@churaverse/core-ui-plugin-client/domain/interface/IRender/IDialog'
import { GameSection } from '../ui/gameSection'

export interface IGameDialog extends IDialog<GameSection> {}

declare module '@churaverse/core-ui-plugin-client/interface/IDialogSwitcher' {
  export interface DialogMap {
    game: IGameDialog
  }
}
