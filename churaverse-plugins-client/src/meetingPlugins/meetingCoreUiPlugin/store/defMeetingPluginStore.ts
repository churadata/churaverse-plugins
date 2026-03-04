import { Room } from 'livekit-client'

export interface ChatMessage {
  type: 'chat' | 'chat_history'
  sender: string
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
  room?: Room
  isConnected: boolean
}
