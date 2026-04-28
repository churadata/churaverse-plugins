import { Room, RoomEvent, RemoteParticipant, DataPacket_Kind } from 'livekit-client'

const CHAT_MESSAGE_TYPE = {
  CHAT: 'chat',
  CHAT_HISTORY: 'chat_history',
} as const

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

type ParsedDataPacket = Record<string, unknown> & { type: string }

interface NormalizedIncomingChat {
  messageId: string | undefined
  senderId: string
  sender: string
  timestamp: number
  text: string
}

export class LiveKitChatService {
  private readonly chatHistory: ChatMessage[] = []
  private handler?: ChatMessageHandler

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

  public setHandler(handler: ChatMessageHandler): void {
    this.handler = handler
  }

  public async sendChat(text: string): Promise<void> {
    const message: ChatMessage = {
      type: CHAT_MESSAGE_TYPE.CHAT,
      messageId: this.generateMessageId(),
      sender: this.ownDisplayName,
      senderId: this.ownParticipantId,
      text,
      timestamp: Date.now(),
    }

    await this.publishReliableData(message)
    this.chatHistory.push(message)
    this.handler?.onChatMessage(this.ownParticipantId, this.ownDisplayName, text)
  }

  private handleDataReceived(payload: Uint8Array, participant: RemoteParticipant | undefined): void {
    const message = this.parsePayload(payload)
    if (message === undefined) return

    if (message.type === CHAT_MESSAGE_TYPE.CHAT_HISTORY && Array.isArray(message.history)) {
      this.handleChatHistory(message.history)
    } else if (
      message.type === CHAT_MESSAGE_TYPE.CHAT &&
      typeof message.text === 'string' &&
      participant !== undefined
    ) {
      this.handleChatMessage(message, participant)
    }
  }

  private parsePayload(payload: Uint8Array): ParsedDataPacket | undefined {
    try {
      const parsed: unknown = JSON.parse(new TextDecoder().decode(payload))
      if (typeof parsed !== 'object' || parsed === null) return undefined
      const message = parsed as Record<string, unknown>
      if (typeof message.type !== 'string') return undefined
      return message as ParsedDataPacket
    } catch {
      return undefined
    }
  }

  private handleChatHistory(history: unknown[]): void {
    for (const entry of history) {
      if (typeof entry !== 'object' || entry === null) continue
      const h = entry as Record<string, unknown>
      const normalized = this.normalizeIncomingChat(h, 'history')
      if (normalized === undefined) continue
      if (this.isDuplicate(normalized.messageId, normalized.senderId, normalized.timestamp)) continue

      this.appendChatFromNormalized(normalized)
    }
  }

  private handleChatMessage(message: ParsedDataPacket, participant: RemoteParticipant): void {
    const normalized = this.normalizeIncomingChat(message, 'live', participant)
    if (normalized === undefined) return
    if (this.isDuplicate(normalized.messageId, normalized.senderId, normalized.timestamp)) return

    this.appendChatFromNormalized(normalized)
  }

  private appendChatFromNormalized(normalized: NormalizedIncomingChat): void {
    const msg: ChatMessage = {
      type: CHAT_MESSAGE_TYPE.CHAT,
      messageId: normalized.messageId,
      sender: normalized.sender,
      senderId: normalized.senderId,
      text: normalized.text,
      timestamp: normalized.timestamp,
    }
    this.chatHistory.push(msg)
    this.handler?.onChatMessage(normalized.senderId, normalized.sender, normalized.text)
  }

  private normalizeIncomingChat(
    raw: Record<string, unknown>,
    mode: 'history' | 'live',
    participant?: RemoteParticipant
  ): NormalizedIncomingChat | undefined {
    if (typeof raw.text !== 'string') return undefined

    let timestamp: number
    if (typeof raw.timestamp === 'number') {
      timestamp = raw.timestamp
    } else if (mode === 'live') {
      timestamp = Date.now()
    } else {
      return undefined
    }

    const messageId =
      typeof raw.messageId === 'string' ? raw.messageId : this.buildLegacyMessageId(raw)

    if (mode === 'history') {
      if (typeof raw.sender !== 'string') return undefined
      const senderId = typeof raw.senderId === 'string' ? raw.senderId : raw.sender
      return { messageId, senderId, sender: raw.sender, timestamp, text: raw.text }
    }

    if (participant === undefined) return undefined
    const senderId = typeof raw.senderId === 'string' ? raw.senderId : participant.identity
    const sender = typeof raw.sender === 'string' ? raw.sender : participant.identity
    return { messageId, senderId, sender, timestamp, text: raw.text }
  }

  private sendChatHistory(destination: RemoteParticipant): void {
    if (this.chatHistory.length === 0) return

    const historyMessage: ChatMessage = {
      type: CHAT_MESSAGE_TYPE.CHAT_HISTORY,
      messageId: this.generateMessageId(),
      sender: this.ownDisplayName,
      senderId: this.ownParticipantId,
      text: '', // 本文は history 配列側。型を chat と揃えるため空
      timestamp: Date.now(),
      history: this.chatHistory,
    }

    void this.publishReliableData(historyMessage, [destination])
  }

  private publishReliableData(message: ChatMessage, destinations?: RemoteParticipant[]): Promise<void> {
    const data = new TextEncoder().encode(JSON.stringify(message))
    return this.room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE, destinations)
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
