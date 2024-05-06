import { IChatBoardRenderer } from './IChatBoardRenderer'
import { ITextChatDialog } from './ITextChatDialog'
import { IChatInputRenderer } from '../textChatInput/IChatInputRenderer'
import { ITopBarIconRenderer } from '@churaverse/core-ui-plugin-client/interface/IDialogIconRenderer'
import { IBadgeHolder } from '@churaverse/core-ui-plugin-client/interface/ITopBarIconHasBadge'

export interface ITextChatUi {
  textChatDialog: ITextChatDialog
  textChatBoard: IChatBoardRenderer
  textChatInput: IChatInputRenderer
  textChatIcon: ITopBarIconRenderer & IBadgeHolder
}
