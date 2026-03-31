import { MeetingRoom } from '../meetingRoom'

declare module 'churaverse-engine-client' {
  export interface StoreInMeeting {
    meetingPlugin: MeetingPluginStore
  }
}

export interface MeetingPluginStore {
  readonly participantId: string
  readonly displayName: string
  meetingRoom?: MeetingRoom
  isConnected: boolean
}
