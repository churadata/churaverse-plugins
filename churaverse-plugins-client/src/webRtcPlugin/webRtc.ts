import { Room, RoomOptions, VideoPresets } from 'livekit-client'
import { WebRtcPlugin } from './webRtcPlugin'

/**
 * backend_livekitが返すアクセストークンのJSON
 */
interface AccessTokenResponse {
  token: string
}

export class WebRtc {
  public readonly room: Room

  public constructor(ownPlayerId: string) {
    const roomOptions: RoomOptions = {
      // automatically manage subscribed video quality
      // オンにしてはいけない。Phaserに映像が上手く流せなくなるため。
      // Phaserとの相性が悪いのか、実装方法が悪いのか、streamがずっとpause状態のままになってしまう。
      adaptiveStream: false,

      // optimize publishing bandwidth and CPU for published tracks
      dynacast: true,

      // default capture settings
      videoCaptureDefaults: {
        resolution: VideoPresets.h1080.resolution,
      },
    }
    this.room = new Room(roomOptions)

    void this.connect(ownPlayerId)
  }

  private async connect(ownPlayerId: string): Promise<void> {
    try {
      const token = await this.getAccessToken(ownPlayerId)
      await this.room.connect(WebRtcPlugin.backendLivekitUrl, token)

      console.log(`connected to room. roomName: ${this.room.name}`)
    } catch {
      console.error(`Failed to connect to room.`)
      window.alert('chromeでの利用を推奨します')
    }
  }

  private async getAccessToken(ownPlayerId: string): Promise<string> {
    const params = {
      roomName: 'room1',
      userName: ownPlayerId,
    }
    const query = new URLSearchParams(params).toString()
    const res = await fetch(`${WebRtcPlugin.backendLivekitUrl}/?${query}`)
    const data = (await res.json()) as AccessTokenResponse
    return data.token
  }

  public async disconnect(): Promise<void> {
    await this.room.disconnect()
  }
}
