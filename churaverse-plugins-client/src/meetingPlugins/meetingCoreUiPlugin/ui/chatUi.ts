import { DomManager } from 'churaverse-engine-client'
import { CHAT_MESSAGES_ID } from '../components/MeetingSidebarComponent'
import { ChatMessageComponent } from '../components/ChatMessageComponent'

export class ChatUi {
  public constructor(private readonly ownParticipantId: string) {}

  public addMessage(senderId: string, senderLabel: string, text: string): void {
    const chatMessages = document.getElementById(CHAT_MESSAGES_ID)
    if (chatMessages === null) return

    const thresholdPx = 100  // 許容誤差
    const wasNearBottom = chatMessages.scrollTop + chatMessages.clientHeight >= chatMessages.scrollHeight - thresholdPx

    const messageEl = DomManager.jsxToDom(
      ChatMessageComponent({
        senderLabel,
        text,
        isOwn: senderId === this.ownParticipantId,
      })
    )
    chatMessages.appendChild(messageEl)
    if (wasNearBottom) {
      chatMessages.scrollTop = chatMessages.scrollHeight
    }
  }
}
