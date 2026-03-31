import { LiveKitSession } from './livekit'

/**
 * MainScene用のLiveKitセッション。
 * 共通基盤のLiveKitSessionをmainプロファイルで使用する。
 */
export class WebRtc extends LiveKitSession {
  public constructor(ownPlayerId: string, ownPlayerName: string) {
    super('main')
    void this.connect(ownPlayerId, ownPlayerName).catch((err: unknown) => {
      console.error('[WebRtc] Failed to connect to LiveKit:', err)
    })
  }
}
