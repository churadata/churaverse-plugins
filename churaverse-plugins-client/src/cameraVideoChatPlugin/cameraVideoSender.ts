import { CameraEffectId, IVideoSender } from './interface/IVideoSender'
import {
  LocalParticipant,
  LocalTrack,
  LocalTrackPublication,
  LocalVideoTrack,
  Room,
  RoomEvent,
  Track,
  VideoPresets,
  VideoCaptureOptions,
  createLocalVideoTrack,
} from 'livekit-client'
import { IMainScene, Store } from 'churaverse-engine-client'
import { TriggerVideoSendingEvent } from './event/event'
import {
  IWebCameraIdDebugDetailScreen,
  IWebCameraMyStatusDebugDetailScreen,
} from './debugScreen/IDebugScreen/IWebCameraInfoDebugScreen'
import '@churaverse/popup-screen-list-plugin-client'
import { EffectManager } from './effectManager'

export class CameraVideoSender implements IVideoSender {
  private localVideoTrack: LocalVideoTrack | undefined = undefined

  public constructor(
    private readonly room: Room,

    private readonly store: Store<IMainScene>,
    private readonly effectManager: EffectManager,
    private readonly webCameraIdDebugDetailScreen: IWebCameraIdDebugDetailScreen,
    private readonly webCameraMyStatusDebugDetailScreen: IWebCameraMyStatusDebugDetailScreen
  ) {
    this.room
      .on(RoomEvent.LocalTrackPublished, this.onStartStream.bind(this))
      .on(RoomEvent.LocalTrackUnpublished, this.onStopStream.bind(this))
      .on(RoomEvent.ActiveDeviceChanged, this.onActiveDeviceChanged.bind(this))
  }

  /**
   * カメラが切り替わった際に、Processorが正しく切り替わらないため、一度切ってから再度ストリーミングを開始する。
   */
  private onActiveDeviceChanged(): void {
    void Promise.resolve().then(async () => {
      if (this.localVideoTrack != null) {
        await this.localVideoTrack?.stopProcessor()
        const track = this.room.localParticipant.getTrack(Track.Source.Camera)
        if (track?.videoTrack != null) {
          // 切り替わる前のtrackが送出されるのは困るため、一度unpublishする
          await this.room.localParticipant.unpublishTrack(track?.videoTrack as LocalTrack)
          await this.startStream()
        }
      }
    })
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
    this.localVideoTrack = undefined
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
      // 将来的に解像度は変更できるようにしたい
      resolution: VideoPresets.h360,
      deviceId: this.room.getActiveDevice('videoinput'),
    }

    const videoTrack = await createLocalVideoTrack(videoCaptureOptions)
    const effect = this.effectManager.getEffectMode()
    this.localVideoTrack = videoTrack
    await this.setEffect(effect)
    await this.room.localParticipant.publishTrack(videoTrack)

    return this.room.localParticipant.isCameraEnabled
  }

  public async stopStream(): Promise<boolean> {
    await this.room.localParticipant.setCameraEnabled(false)
    if (this.localVideoTrack != null) {
      await this.localVideoTrack.stopProcessor()
      await this.room.localParticipant.unpublishTrack(this.localVideoTrack)
    }
    // 終了失敗=isCameraEnabledがtrueの時なので, isCameraEnabledの否定を返す
    return !this.room.localParticipant.isCameraEnabled
  }

  public async setEffect(mode: CameraEffectId): Promise<void> {
    this.effectManager.setEffectMode(mode)
    const effect = this.effectManager.getEffect()
    if (this.localVideoTrack != null) {
      if (mode === 'dummy') await this.localVideoTrack.stopProcessor()
      else if (effect != null) await this.localVideoTrack.setProcessor(effect)
    }
  }
}
