import { Room, RoomOptions, VideoPresets } from 'livekit-client'
import { getChuraverseConfig } from 'churaverse-engine-client'
import { fetchLivekitToken } from './utils/fetchLivekitToken'

const MEETING_ROOM_NAME = 'meeting-room'

export class MeetingRoom {
  public readonly room: Room

  public constructor() {
    const roomOptions: RoomOptions = {
      adaptiveStream: true,
      dynacast: true,
      videoCaptureDefaults: {
        resolution: VideoPresets.h720.resolution,
      },
    }
    this.room = new Room(roomOptions)
  }

  public async connect(participantId: string, displayName: string): Promise<void> {
    const token = await fetchLivekitToken(
      getChuraverseConfig().backendLivekitUrl,
      MEETING_ROOM_NAME,
      participantId,
      displayName
    )
    const livekitUrl = getChuraverseConfig().livekitUrl
    await this.room.connect(livekitUrl, token)
  }

  public async disconnect(): Promise<void> {
    await this.room.disconnect()
  }
}
