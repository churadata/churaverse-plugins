import { MeetingRoom } from '../meetingRoom'
import { ChatMessage } from '../domain/chatMessage'

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
