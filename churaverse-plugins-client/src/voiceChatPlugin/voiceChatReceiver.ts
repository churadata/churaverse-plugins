import { RemoteParticipant, RemoteTrack, RemoteTrackPublication, Room, RoomEvent, Track } from 'livekit-client'
import { IEventBus, IMainScene } from 'churaverse-engine-client'
import { JoinVoiceChatEvent } from './event/joinVoiceChatEvent'
import { UnmuteEvent } from './event/unmuteEvent'
import { MuteEvent } from './event/muteEvent'
import { LeaveVoiceChatEvent } from './event/leaveVoiceChatEvent'
import { PlayerVoiceChatIcons } from './ui/playerVoiceChatIcons'

/**
 * 他プレイヤーのボイスチャットの開始・終了を受け取るクラス
 */
export class VoiceChatReceiver {
  public constructor(
    private readonly room: Room,
    private readonly eventBus: IEventBus<IMainScene>,
    private readonly playerVoiceChatUis: Map<string, PlayerVoiceChatIcons>
  ) {
    this.room
      .on(RoomEvent.TrackSubscribed, this.onJoin.bind(this))
      .on(RoomEvent.TrackUnsubscribed, this.onLeave.bind(this))
  }

  /**
   * ボイスチャット開始時に実行される関数
   */
  private onJoin(track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant): void {
    if (track.source !== Track.Source.Microphone) return

    const remoteTrackPublication = participant.getTrackPublication(Track.Source.Microphone)
    if (remoteTrackPublication?.audioTrack == null || remoteTrackPublication.track == null) {
      return
    }

    const voice = remoteTrackPublication.track.attach()

    this.eventBus.post(new JoinVoiceChatEvent(participant.identity, voice))

    remoteTrackPublication.addListener('subscriptionStatusChanged', () => {
      if (!track.isMuted) {
        this.eventBus.post(new UnmuteEvent(participant.identity))
      }
    })

    remoteTrackPublication.addListener('unmuted', () => {
      this.eventBus.post(new UnmuteEvent(participant.identity))
    })

    remoteTrackPublication.addListener('muted', () => {
      this.eventBus.post(new MuteEvent(participant.identity))
    })

    participant.addListener('isSpeakingChanged', () => {
      const playerMicIcon = this.playerVoiceChatUis.get(participant.identity)?.playerMicIcon
      playerMicIcon?.setAlphaToMicIcon(participant.audioLevel * 5)
    })
  }

  /**
   * ボイスチャット終了時に実行される関数
   */
  private onLeave(track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant): void {
    if (track.source !== Track.Source.Microphone) return

    participant.getTrackPublication(Track.Source.Microphone)?.track?.detach()
    this.eventBus.post(new LeaveVoiceChatEvent(participant.identity))
  }
}
