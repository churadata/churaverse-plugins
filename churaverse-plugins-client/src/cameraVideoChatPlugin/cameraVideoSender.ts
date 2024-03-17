import { IVideoSender } from './interface/IVideoSender'
import { LocalParticipant, LocalTrackPublication, Room, RoomEvent, Track, VideoCaptureOptions } from 'livekit-client'
import { IMainScene, Store } from 'churaverse-engine-client'
import { TriggerVideoSendingEvent } from './event/event'
import {
  IWebCameraIdDebugDetailScreen,
  IWebCameraMyStatusDebugDetailScreen,
} from './debugScreen/IDebugScreen/IWebCameraInfoDebugScreen'

export class CameraVideoSender implements IVideoSender {
  public constructor(
    private readonly room: Room,
    private readonly store: Store<IMainScene>,
    private readonly webCameraIdDebugDetailScreen: IWebCameraIdDebugDetailScreen,
    private readonly webCameraMyStatusDebugDetailScreen: IWebCameraMyStatusDebugDetailScreen
  ) {
    this.room
      .on(RoomEvent.LocalTrackPublished, this.onStartStream.bind(this))
      .on(RoomEvent.LocalTrackUnpublished, this.onStopStream.bind(this))
  }

  private onStartStream(publication: LocalTrackPublication, participant: LocalParticipant): void {
    if (publication.kind !== 'video') return
    const track = publication.track
    if (track == null) return
    if (publication.source !== Track.Source.Camera) return
    this.store.of('popUpScreenList').addScreen(participant.identity, track.attach() as HTMLVideoElement)
  }

  private onStopStream(publication: LocalTrackPublication, participant: LocalParticipant): void {
    if (publication.kind !== 'video') return
    if (publication.source !== Track.Source.Camera) return
    this.store.of('popUpScreenList').removeScreen(participant.identity)
  }

  public handleVideoSendTrigger(ev: TriggerVideoSendingEvent): void {
    const { status: isActive } = ev
    const ownPlayerId = this.store.of('playerPlugin').ownPlayerId
    if (isActive) {
      void this.startStream().then((result) => {
        if (result) {
          this.webCameraIdDebugDetailScreen.update(ownPlayerId)
          this.webCameraMyStatusDebugDetailScreen.update(true)
        }
      })
    } else {
      void this.stopStream().then((result) => {
        if (result) {
          this.webCameraIdDebugDetailScreen.update(ownPlayerId)
          this.webCameraMyStatusDebugDetailScreen.update(false)
        }
      })
    }
  }

  /**
   * カメラ映像を有効にし、エフェクトを適用した映像のストリーミングを開始する。
   * @returns
   */
  public async startStream(): Promise<boolean> {
    const videoCaptureOptions: VideoCaptureOptions = {
      resolution: {
        width: 720,
        height: 480,
        frameRate: 30,
      },
    }
    await this.room.localParticipant.setCameraEnabled(true, videoCaptureOptions)
    return this.room.localParticipant.isCameraEnabled
  }

  public async stopStream(): Promise<boolean> {
    await this.room.localParticipant.setCameraEnabled(false)
    // 終了失敗=isCameraEnabledがtrueの時なので, isCameraEnabledの否定を返す
    return !this.room.localParticipant.isCameraEnabled
  }

  public async setEffect(): Promise<void> {}
}
