import { IChatBoardRenderer } from '../interface/IChatBoardRenderer'
import { TextChat } from '../../model/textChat'
import { DomManager } from 'churaverse-engine-client'
import { TextChatMessageBlockComponent } from './components/TextChatMessageBlockComponent'
import { TextChatBoardComponent } from './components/TextChatBoardComponent'
import { TextChatDialog } from '../textChatDialog/textChatDialog'

export const TEXT_CHAT_BOARD_CONTAINER_ID = 'text-chat-board'

/**
 * チャット表示部分
 */
export class TextChatBoard implements IChatBoardRenderer {
  private readonly chatBoardElement: HTMLElement
  public constructor(private readonly playerId: string, textChatDialog: TextChatDialog) {
    textChatDialog.directlyAddContent(DomManager.addJsxDom(TextChatBoardComponent()))
    this.chatBoardElement = DomManager.getElementById(TEXT_CHAT_BOARD_CONTAINER_ID)
  }

  /**
   * メッセージが追加されると自動でスクロールする
   */
  public scrollToBottom(): void {
    this.chatBoardElement.scrollTop = this.chatBoardElement.scrollHeight
  }

  /**
   * テキストチャットにメッセージを追加する
   * @param textChat 追加したい要素
   */
  public add(textChat: TextChat, textColor: string = '#333333'): void {
    const messageElement = DomManager.jsxToDom(TextChatMessageBlockComponent({ textChat, textColor }))
    this.chatBoardElement.appendChild(messageElement)
    this.scrollToBottom()
  }

  /**
   * 全メッセージの再描画
   * @param allChat 再描画する全メッセージリスト
   */

  public redraw(allChat: TextChat[]): void {
    // 全部削除
    while (this.chatBoardElement.firstChild != null) {
      this.chatBoardElement.removeChild(this.chatBoardElement.firstChild)
    }

    allChat.forEach((t) => this.add(t))
  }
}
