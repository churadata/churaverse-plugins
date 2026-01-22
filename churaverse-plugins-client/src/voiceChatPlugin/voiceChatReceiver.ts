import {
  RemoteAudioTrack,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
  Track,
} from 'livekit-client'
import { IEventBus, IMainScene } from 'churaverse-engine-client'
import { JoinVoiceChatEvent } from './event/joinVoiceChatEvent'
import { UnmuteEvent } from './event/unmuteEvent'
import { MuteEvent } from './event/muteEvent'
import { LeaveVoiceChatEvent } from './event/leaveVoiceChatEvent'
import { PlayerVoiceChatIcons } from './ui/playerVoiceChatIcons'
import { IAudioService } from './domain/IAudioService'

/**
 * 他プレイヤーのボイスチャットの開始・終了を受け取るクラス
 */
export class VoiceChatReceiver {
  public constructor(
    private readonly room: Room,
    private readonly audioService: IAudioService,
    private readonly eventBus: IEventBus<IMainScene>,
    private readonly playerVoiceChatUis: Map<string, PlayerVoiceChatIcons>
  ) {
    this.room
      .on(RoomEvent.TrackSubscribed, this.onJoin.bind(this))
      .on(RoomEvent.TrackUnsubscribed, this.onLeave.bind(this))
  }

  /**
   * ボイスチャット開始時に実行される関数
   * LiveKit が source を Unknown と扱っても track.kind=audio なら受ける。
  */
  private onJoin(track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant): void {
    // LiveKit が source を Unknown として扱うケースがあるため、音声トラックなら受ける
    if (track.kind !== Track.Kind.Audio) return

    // publication から audioTrack を優先的に取得し、無ければ track を RemoteAudioTrack として扱う
    const audioTrack = (publication.audioTrack as RemoteAudioTrack | null) ?? (track as RemoteAudioTrack | null)
    if (audioTrack == null) return

    // LiveKit の RemoteAudioTrack を AudioService に委譲して Web Audio グラフへ接続
    this.audioService.addRemoteTrack(participant.identity, audioTrack)
    this.eventBus.post(new JoinVoiceChatEvent(participant.identity))

    publication.addListener('subscriptionStatusChanged', () => {
      if (!track.isMuted) {
        this.eventBus.post(new UnmuteEvent(participant.identity))
      }
    })

    publication.addListener('unmuted', () => {
      this.eventBus.post(new UnmuteEvent(participant.identity))
    })

    publication.addListener('muted', () => {
      this.eventBus.post(new MuteEvent(participant.identity))
    })

    participant.addListener('isSpeakingChanged', (speaking) => {
      const playerMicIcon = this.playerVoiceChatUis.get(participant.identity)?.playerMicIcon
      playerMicIcon?.setAlphaToMicIcon(participant.audioLevel * 5)
    })
  }

  /**
   * ボイスチャット終了時に実行される関数
   */
  private onLeave(track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant): void {
    if (track.kind !== Track.Kind.Audio) return

    this.audioService.removeRemoteTrack(participant.identity)
    this.eventBus.post(new LeaveVoiceChatEvent(participant.identity))
  }
}
