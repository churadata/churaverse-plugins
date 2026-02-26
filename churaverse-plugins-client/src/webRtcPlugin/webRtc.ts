import { Room, RoomEvent, RoomOptions, VideoPresets, DataPacket_Kind } from 'livekit-client'

/**
 * backend_livekitが返すアクセストークンのJSON
 */
interface AccessTokenResponse {
  token: string
}

interface NameAnnounceMessage {
  type: 'name_announce'
  displayName: string
}

export class WebRtc {
  public readonly room: Room

  public constructor(ownPlayerId: string, ownPlayerName: string) {
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

    void this.connect(ownPlayerId, ownPlayerName)
  }

  private async connect(ownPlayerId: string, displayName: string): Promise<void> {
    try {
      const token = await this.getAccessToken(ownPlayerId, displayName)
      await this.room.connect(`${import.meta.env.VITE_LIVEKIT_URL ?? 'ws://localhost:8080/livekit'}`, token)

      await this.room.localParticipant.setName(displayName)

      console.log(`connected to room. roomName: ${this.room.name}, displayName: ${displayName}`)

      this.broadcastName(displayName)

      this.room.on(RoomEvent.ParticipantConnected, () => {
        this.broadcastName(displayName)
      })
    } catch (e) {
      console.error(`Failed to connect to room.`,e)
      window.alert('chromeでの利用を推奨します')
    }
  }

  private broadcastName(displayName: string): void {
    const message: NameAnnounceMessage = { type: 'name_announce', displayName }
    const data = new TextEncoder().encode(JSON.stringify(message))
    void this.room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE)
  }

  private async getAccessToken(ownPlayerId: string, displayName: string): Promise<string> {
    const params: Record<string, string> = {
      roomName: 'meeting-room',
      userName: ownPlayerId,
      displayName,
    }
    const query = new URLSearchParams(params).toString()
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_LIVEKIT_URL ?? 'http://localhost:8080/backend_livekit'}/?${query}`
    )
    const data = (await res.json()) as AccessTokenResponse
    return data.token
  }

  public async disconnect(): Promise<void> {
    await this.room.disconnect()
  }
}
