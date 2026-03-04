import { Room, RoomOptions, VideoPresets } from 'livekit-client'

interface AccessTokenResponse {
  token: string
}

export async function fetchLivekitToken(
  backendUrl: string,
  roomName: string,
  userName: string
): Promise<string> {
  const params = { roomName, userName }
  const query = new URLSearchParams(params).toString()
  const res = await fetch(`${backendUrl}/?${query}`)
  const data = (await res.json()) as AccessTokenResponse
  return data.token
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
      const backendUrl = import.meta.env.VITE_BACKEND_LIVEKIT_URL ?? 'http://localhost:8080/backend_livekit'
      const token = await fetchLivekitToken(backendUrl, 'room1', ownPlayerId)
      await this.room.connect(`${import.meta.env.VITE_LIVEKIT_URL ?? 'ws://localhost:8080/livekit'}`, token)

      console.log(`connected to room. roomName: ${this.room.name}`)
    } catch (e) {
      console.error(`Failed to connect to room.`, e)
      window.alert('chromeでの利用を推奨します')
    }
  }

  public async disconnect(): Promise<void> {
    await this.room.disconnect()
  }
}
