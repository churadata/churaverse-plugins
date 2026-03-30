import { Room, RoomEvent, RemoteParticipant, DataPacket_Kind } from 'livekit-client'

export interface ChatMessage {
  type: 'chat' | 'chat_history'
  messageId?: string
  sender: string
  senderId?: string
  text: string
  timestamp: number
  history?: ChatMessage[]
}

export interface ChatMessageHandler {
  onChatMessage: (senderId: string, senderName: string, text: string) => void
}

export class LiveKitChatService {
  private readonly chatHistory: ChatMessage[] = []

  public constructor(
    private readonly room: Room,
    private readonly ownParticipantId: string,
    private readonly ownDisplayName: string
  ) {
    this.room.on(RoomEvent.DataReceived, (payload, participant) => {
      this.handleDataReceived(payload, participant)
    })

    this.room.on(RoomEvent.ParticipantConnected, (participant) => {
      this.sendChatHistory(participant)
    })
  }

  private handler?: ChatMessageHandler

  public setHandler(handler: ChatMessageHandler): void {
    this.handler = handler
  }

  public getHistory(): readonly ChatMessage[] {
    return this.chatHistory
  }

  public async sendChat(text: string): Promise<void> {
    const message: ChatMessage = {
      type: 'chat',
      messageId: this.generateMessageId(),
      sender: this.ownDisplayName,
      senderId: this.ownParticipantId,
      text,
      timestamp: Date.now(),
    }

    const data = new TextEncoder().encode(JSON.stringify(message))
    await this.room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE)
    this.chatHistory.push(message)
    this.handler?.onChatMessage(this.ownParticipantId, this.ownDisplayName, text)
  }

  private handleDataReceived(payload: Uint8Array, participant: RemoteParticipant | undefined): void {
    const message = this.parsePayload(payload)
    if (message === undefined) return

    if (message.type === 'chat_history' && Array.isArray(message.history)) {
      this.handleChatHistory(message.history)
    } else if (message.type === 'chat' && typeof message.text === 'string' && participant !== undefined) {
      this.handleChatMessage(message, participant)
    }
  }

  private parsePayload(payload: Uint8Array): Record<string, unknown> | undefined {
    try {
      const parsed: unknown = JSON.parse(new TextDecoder().decode(payload))
      if (typeof parsed !== 'object' || parsed === null) return undefined
      const message = parsed as Record<string, unknown>
      if (typeof message.type !== 'string') return undefined
      return message
    } catch {
      return undefined
    }
  }

  private handleChatHistory(history: unknown[]): void {
    for (const entry of history) {
      if (typeof entry !== 'object' || entry === null) continue
      const h = entry as Record<string, unknown>
      if (typeof h.timestamp !== 'number' || typeof h.sender !== 'string' || typeof h.text !== 'string') continue
      const messageId = typeof h.messageId === 'string' ? h.messageId : this.buildLegacyMessageId(h)
      const senderId = typeof h.senderId === 'string' ? h.senderId : h.sender

      if (this.isDuplicate(messageId, senderId, h.timestamp as number)) continue

      const msg: ChatMessage = {
        type: 'chat',
        messageId,
        sender: h.sender,
        senderId,
        text: h.text,
        timestamp: h.timestamp as number,
      }
      this.chatHistory.push(msg)
      this.handler?.onChatMessage(senderId, msg.sender, msg.text)
    }
  }

  private handleChatMessage(message: Record<string, unknown>, participant: RemoteParticipant): void {
    const messageId = typeof message.messageId === 'string' ? message.messageId : this.buildLegacyMessageId(message)
    const senderId = typeof message.senderId === 'string' ? message.senderId : participant.identity
    const sender = typeof message.sender === 'string' ? message.sender : participant.identity
    const timestamp = typeof message.timestamp === 'number' ? message.timestamp : Date.now()

    if (this.isDuplicate(messageId, senderId, timestamp)) return

    const msg: ChatMessage = { type: 'chat', messageId, sender, senderId, text: message.text as string, timestamp }
    this.chatHistory.push(msg)
    this.handler?.onChatMessage(senderId, sender, msg.text)
  }

  private sendChatHistory(destination: RemoteParticipant): void {
    if (this.chatHistory.length === 0) return

    const historyMessage: ChatMessage = {
      type: 'chat_history',
      messageId: this.generateMessageId(),
      sender: this.ownDisplayName,
      senderId: this.ownParticipantId,
      text: '',
      timestamp: Date.now(),
      history: this.chatHistory,
    }

    const data = new TextEncoder().encode(JSON.stringify(historyMessage))
    void this.room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE, [destination])
  }

  private isDuplicate(messageId: string | undefined, senderId: string, timestamp: number): boolean {
    if (messageId !== undefined) {
      return this.chatHistory.some((m) => m.messageId === messageId)
    }
    return this.chatHistory.some((m) => m.timestamp === timestamp && (m.senderId ?? m.sender) === senderId)
  }

  private generateMessageId(): string {
    if (globalThis.crypto?.randomUUID !== undefined) {
      return globalThis.crypto.randomUUID()
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  }

  private buildLegacyMessageId(message: Record<string, unknown>): string | undefined {
    if (
      typeof message.timestamp !== 'number' ||
      typeof message.sender !== 'string' ||
      typeof message.text !== 'string'
    ) {
      return undefined
    }
    const senderId = typeof message.senderId === 'string' ? message.senderId : message.sender
    return `${senderId}:${message.timestamp}:${message.text}`
  }
}
