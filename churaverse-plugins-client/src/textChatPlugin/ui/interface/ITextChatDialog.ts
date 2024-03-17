import { IDialog } from '../../../../domain/IRender/IDialog'
import { TextChatSection } from '../textChatDialog/textChatSection'

export interface ITextChatDialog extends IDialog<TextChatSection> {}

declare module '../../../coreUiPlugin/interface/IDialogSwitcher' {
  export interface DialogMap {
    chat: ITextChatDialog
  }
}