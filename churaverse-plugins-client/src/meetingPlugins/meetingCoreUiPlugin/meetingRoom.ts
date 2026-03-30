import { LiveKitSession } from '../../webRtcPlugin/livekit'

/**
 * MeetingScene用のLiveKitセッション。
 * 共通基盤のLiveKitSessionをmeetingプロファイルで使用する。
 */
export class MeetingRoom extends LiveKitSession {
  public constructor() {
    super('meeting')
  }
}
