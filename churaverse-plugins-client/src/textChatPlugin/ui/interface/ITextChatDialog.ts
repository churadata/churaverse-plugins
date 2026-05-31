import { IDialog } from '@churaverse/core-ui-plugin-client/domain/interface/IRender/IDialog'

/**
 * チャットダイアログのインターフェース
 * switcherとの互換性を保つため IDialog<any> を継承
 */
export interface ITextChatDialog extends IDialog<any> {
  open(): void
  close(): void
  readonly isOpen: boolean
}

// DialogMap への登録
declare module '@churaverse/core-ui-plugin-client/interface/IDialogSwitcher' {
  export interface DialogMap {
    chat: ITextChatDialog
  }
}
