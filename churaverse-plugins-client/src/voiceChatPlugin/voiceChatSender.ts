import {
  LocalParticipant,
  LocalTrackPublication,
  Participant,
  Room,
  RoomEvent,
  Track,
  TrackPublication,
} from 'livekit-client'
import { IVoiceChatSender } from './domain/IVoiceChatSender'
import { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import { UnmuteEvent } from './event/unmuteEvent'
import { MuteEvent } from './event/muteEvent'
import { NetworkPluginStore } from '@churaverse/network-plugin-client/store/defNetworkPluginStore'
import { ToggleMicMessage } from './message/toggleMicMessage'
import { VoiceChatPluginStore } from './store/defVoiceChatPluginStore'
import { IAudioService } from './domain/IAudioService'

export class VoiceChatSender implements IVoiceChatSender {
  private readonly networkPluginStore!: NetworkPluginStore<IMainScene>
  private readonly voiceChatPluginStore!: VoiceChatPluginStore
  public constructor(
    private readonly room: Room,
    private readonly eventBus: IEventBus<IMainScene>,
    private readonly store: Store<IMainScene>,
    private readonly ownPlayerId: string,
    private readonly audioService?: IAudioService
  ) {
    room.on(RoomEvent.LocalTrackPublished, this.onStartStream.bind(this))
    room.on(RoomEvent.LocalTrackUnpublished, this.onStopStream.bind(this))
    room.on(RoomEvent.TrackUnmuted, this.onUnmuted.bind(this))
    room.on(RoomEvent.TrackMuted, this.onMuted.bind(this))
    this.networkPluginStore = this.store.of('networkPlugin')
    this.voiceChatPluginStore = this.store.of('voiceChatPlugin')
  }

  private onStartStream(publication: LocalTrackPublication, participant: LocalParticipant): void {
    this.unmute(publication.source, participant.identity)
    participant.addListener('isSpeakingChanged', (speaking) => {
      const playerMicIcon = this.voiceChatPluginStore.playerVoiceChatUis.get(participant.identity)?.playerMicIcon
      playerMicIcon?.setAlphaToMicIcon(participant.audioLevel * 5)
    })
  }

  private onStopStream(publication: LocalTrackPublication, participant: LocalParticipant): void {
    this.mute(publication.source, participant.identity)
  }

  private onUnmuted(publication: TrackPublication, participant: Participant): void {
    this.unmute(publication.source, participant.identity)
  }

  private onMuted(publication: TrackPublication, participant: Participant): void {
    this.mute(publication.source, participant.identity)
  }

  private unmute(source: Track.Source, identity: string): void {
    if (source !== Track.Source.Microphone) return
    if (identity !== this.ownPlayerId) return
    this.eventBus.post(new UnmuteEvent(identity))
    this.networkPluginStore.messageSender.send(new ToggleMicMessage({ playerId: identity, isUnmute: true }))
  }

  private mute(source: Track.Source, identity: string): void {
    if (source !== Track.Source.Microphone) return
    if (identity !== this.ownPlayerId) return
    this.eventBus.post(new MuteEvent(identity))
    this.networkPluginStore.messageSender.send(new ToggleMicMessage({ playerId: identity, isUnmute: false }))
  }

  public async startStream(): Promise<boolean> {
    if (this.audioService !== undefined) {
      return await this.audioService.startLocalMic()
    }
    await this.room.localParticipant.setMicrophoneEnabled(true)
    return this.room.localParticipant.isMicrophoneEnabled
  }

  public async stopStream(): Promise<boolean> {
    if (this.audioService !== undefined) {
      return await this.audioService.stopLocalMic()
    }

    await this.room.localParticipant.setMicrophoneEnabled(false)
    // 終了失敗=isMicrophoneEnabledがtrueの時なので, isMicrophoneEnabledの否定を返す
    return !this.room.localParticipant.isMicrophoneEnabled
  }
}
