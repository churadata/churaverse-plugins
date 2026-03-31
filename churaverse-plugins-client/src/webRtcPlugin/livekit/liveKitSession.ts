import { Room } from 'livekit-client'
import { getChuraverseConfig } from 'churaverse-engine-client'
import { fetchLivekitToken } from './fetchLivekitToken'
import { LiveKitRoomProfileName, getRoomOptions } from './liveKitRoomProfile'

const ROOM_NAME = 'meeting-room'

export class LiveKitSession {
  public readonly room: Room

  public constructor(profile: LiveKitRoomProfileName) {
    this.room = new Room(getRoomOptions(profile))
  }

  public async connect(participantId: string, displayName: string): Promise<void> {
    const token = await fetchLivekitToken(ROOM_NAME, participantId, displayName)
    const livekitUrl = getChuraverseConfig().livekitUrl
    await this.room.connect(livekitUrl, token)
  }

  public async disconnect(): Promise<void> {
    await this.room.disconnect()
  }
}
