import { IDialog } from '@churaverse/core-ui-plugin-client/domain/interface/IRender/IDialog'
import '@churaverse/core-ui-plugin-client/interface/IDialogSwitcher'
import { ChurarenSection } from '../ui/dialog/churarenSection'

export interface IChurarenDialog extends IDialog<ChurarenSection> {}

declare module '@churaverse/core-ui-plugin-client/interface/IDialogSwitcher' {
  export interface DialogMap {
    churaren: IChurarenDialog
  }
}
