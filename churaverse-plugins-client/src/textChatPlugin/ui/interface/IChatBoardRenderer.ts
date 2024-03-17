import { TextChat } from '../../model/textChat'

export interface IChatBoardRenderer {
  add: (textChat: TextChat, textColor?: string) => void
  redraw: (allChat: TextChat[]) => void
}
