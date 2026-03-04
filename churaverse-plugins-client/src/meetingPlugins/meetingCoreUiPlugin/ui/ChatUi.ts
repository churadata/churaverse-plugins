import { DomManager } from 'churaverse-engine-client'
import { CHAT_MESSAGES_ID } from '../components/MeetingSidebarComponent'
import { ChatMessageComponent } from '../components/ChatMessageComponent'

export class ChatUi {
  public constructor(private readonly ownParticipantId: string) {}

  public addMessage(senderId: string, text: string): void {
    const chatMessages = document.getElementById(CHAT_MESSAGES_ID)
    if (chatMessages === null) return

    const messageEl = DomManager.jsxToDom(
      ChatMessageComponent({
        senderId,
        text,
        isSelf: senderId === this.ownParticipantId,
      })
    )
    chatMessages.appendChild(messageEl)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }
}
