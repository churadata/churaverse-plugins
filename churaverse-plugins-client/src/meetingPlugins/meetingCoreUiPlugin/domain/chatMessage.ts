export interface ChatMessage {
  type: 'chat' | 'chat_history'
  messageId?: string
  sender: string
  senderId?: string
  text: string
  timestamp: number
  history?: ChatMessage[]
}
