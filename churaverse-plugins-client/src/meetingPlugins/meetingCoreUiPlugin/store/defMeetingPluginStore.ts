import { MeetingRoom } from '../meetingRoom'

export interface ChatMessage {
  type: 'chat' | 'chat_history'
  messageId?: string
  sender: string
  senderId?: string
  text: string
  timestamp: number
  history?: ChatMessage[]
}

declare module 'churaverse-engine-client' {
  export interface StoreInMeeting {
    meetingPlugin: MeetingPluginStore
  }
}

export interface MeetingPluginStore {
  readonly participantId: string
  readonly displayName: string
  readonly chatHistory: ChatMessage[]
  meetingRoom?: MeetingRoom
  isConnected: boolean
}
