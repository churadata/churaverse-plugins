import { IMeetingScene, Store } from 'churaverse-engine-client'
import { MeetingPluginStore } from './defMeetingPluginStore'

export function initMeetingPluginStore(
  store: Store<IMeetingScene>,
  participantId: string,
  displayName: string
): void {
  const meetingPluginStore: MeetingPluginStore = {
    participantId,
    displayName,
    chatHistory: [],
    room: undefined,
    isConnected: false,
  }
  store.setInit('meetingPlugin', meetingPluginStore)
}
