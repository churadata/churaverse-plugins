import { IChatBoardRenderer } from './IChatBoardRenderer'
import { ITextChatDialog } from './ITextChatDialog'
import { IChatInputRenderer } from '../textChatInput/IChatInputRenderer'
import { ITopBarIconRenderer } from '../../../coreUiPlugin/interface/IDialogIconRenderer'
import { IBadgeHolder } from '../../../coreUiPlugin/interface/ITopBarIconHasBadge'

export interface ITextChatUi {
  textChatDialog: ITextChatDialog
  textChatBoard: IChatBoardRenderer
  textChatInput: IChatInputRenderer
  textChatIcon: ITopBarIconRenderer & IBadgeHolder
}
