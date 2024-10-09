import { IDialog } from '@churaverse/core-ui-plugin-client/domain/interface/IRender/IDialog'
import { TextChatSection } from '../textChatDialog/textChatSection'

export interface ITextChatDialog extends IDialog<TextChatSection> {}

declare module '@churaverse/core-ui-plugin-client/interface/IDialogSwitcher' {
  export interface DialogMap {
    chat: ITextChatDialog
  }
}