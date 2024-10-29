import { IDialog } from '@churaverse/core-ui-plugin-client/domain/interface/IRender/IDialog'
import '@churaverse/core-ui-plugin-client/interface/IDialogSwitcher'
import { SynchroBreakSection } from '../ui/dialog/synchroBreakSection'

export interface ISynchroBreakDialog extends IDialog<SynchroBreakSection> {}

declare module '@churaverse/core-ui-plugin-client/interface/IDialogSwitcher' {
  export interface DialogMap {
    synchroBreak: ISynchroBreakDialog
  }
}
