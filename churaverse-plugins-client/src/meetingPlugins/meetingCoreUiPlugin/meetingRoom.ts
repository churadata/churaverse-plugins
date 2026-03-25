import { Room, RoomOptions, VideoPresets } from 'livekit-client'
import { getChuraverseConfig } from 'churaverse-engine-client'

const MEETING_ROOM_NAME = 'meeting-room'

interface AccessTokenResponse {
  token: string
}

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
    const token = await this.getAccessToken(participantId, displayName)
    const livekitUrl = getChuraverseConfig().livekitUrl
    await this.room.connect(livekitUrl, token)
  }

  public async disconnect(): Promise<void> {
    await this.room.disconnect()
  }

  private async getAccessToken(participantId: string, displayName: string): Promise<string> {
    const backendUrl = getChuraverseConfig().backendLivekitUrl
    const queryParams = new URLSearchParams({ roomName: MEETING_ROOM_NAME, userName: participantId })
    queryParams.set('displayName', displayName)
    const query = queryParams.toString()
    const res = await fetch(`${backendUrl}/?${query}`)
    if (!res.ok) {
      throw new Error(`Failed to get access token: ${res.status} ${res.statusText}`)
    }
    const data = (await res.json()) as AccessTokenResponse
    return data.token
  }
}
