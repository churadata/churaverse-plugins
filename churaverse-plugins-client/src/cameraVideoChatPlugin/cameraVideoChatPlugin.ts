import { IMainScene, BasePlugin } from 'churaverse-engine-client'
import { WebRtcPluginStore } from '@churaverse/web-rtc-plugin-client/store/defWebRtcPluginStore'
import { CameraVideoSender } from './cameraVideoSender'
import { ScreenRecorder } from './screenRecorder'
import { VideoChatUI } from './ui/videoChatUi'
import { RecordIconUI } from './ui/recordIconUi'
import { RecordingIndicator } from './ui/recordingIndicator'
import { TriggerVideoSendingEvent } from './event/event'
import { VideoReceiver } from './videoReceiver'
import {
  IWebCameraIdDebugDetailScreen,
  IWebCameraMyStatusDebugDetailScreen,
} from './debugScreen/IDebugScreen/IWebCameraInfoDebugScreen'
import { DebugScreenPluginStore } from '@churaverse/debug-screen-plugin-client/store/defDebugScreenPluginStore'
import { DebugDetailScreenSection } from '@churaverse/debug-screen-plugin-client/debugScreen/debugDetailScreenSection'
import { WebCameraIdDebugDetailScreen } from './debugScreen/webCameraIdDebugDetailScreen'
import { WebCameraMyStatusDebugDetailScreen } from './debugScreen/webCameraMyStatusDebugDetailScreen'
import { PlayerPluginStore } from '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import { NetworkPluginStore } from '@churaverse/network-plugin-client/store/defNetworkPluginStore'
import { DumpDebugDataEvent } from '@churaverse/debug-screen-plugin-client/event/dumpDebugDataEvent'
import { EffectSettingUI } from './ui/effectSettingUi'
import { EffectManager } from './effectManager'
import { CameraEffectSettingStore } from './cameraEffectSettingStore'
import { IRecordingIndicator } from './interface/IRecordingIndicator'
import { SocketController } from './controller/socketController'
import { OwnPlayerUndefinedError } from '@churaverse/player-plugin-client/errors/ownPlayerUndefinedError'

export class CameraVideoChatPlugin extends BasePlugin<IMainScene> {
  private webRtcPluginStore!: WebRtcPluginStore
  private playerPluginStore!: PlayerPluginStore
  private debugScreenPluginStore!: DebugScreenPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private cameraVideoSender!: CameraVideoSender
  private screenRecorder!: ScreenRecorder
  private videoChatUI!: VideoChatUI
  private recordIconUI!: RecordIconUI

  private cameraVideoReceiver!: VideoReceiver
  private webCameraIdDebugDetailScreen!: IWebCameraIdDebugDetailScreen
  private webCameraMyStatusDebugDetailScreen!: IWebCameraMyStatusDebugDetailScreen
  private effectSettingUI!: EffectSettingUI
  private effectManager!: EffectManager
  private effectSettingStore!: CameraEffectSettingStore
  private recordingIndicator!: IRecordingIndicator

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('triggerVideoSending', this.triggerVideoSending.bind(this))
    this.bus.subscribeEvent('dumpDebugData', this.dumpDebugData.bind(this))
    this.bus.subscribeEvent('videoChatStatusChanged', this.enableVideoChatButton.bind(this))
    this.bus.subscribeEvent('screenRecordStart', this.screenRecordStart.bind(this))
    this.bus.subscribeEvent('screenRecordStop', this.screenRecordStop.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))
  }

  private triggerVideoSending(ev: TriggerVideoSendingEvent): void {
    this.cameraVideoSender.handleVideoSendTrigger(ev)
  }

  private init(): void {
    this.webRtcPluginStore = this.store.of('webRtcPlugin')
    this.playerPluginStore = this.store.of('playerPlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
    this.debugScreenPluginStore = this.store.of('debugScreenPlugin')
    this.videoChatUI = new VideoChatUI(this.store, this.bus)
    this.effectSettingStore = new CameraEffectSettingStore(this.bus, this.store)
    this.effectManager = new EffectManager(this.effectSettingStore)
    this.setupDebugScreen()
    this.cameraVideoSender = new CameraVideoSender(
      this.webRtcPluginStore.webRtc.room,
      this.store,
      this.bus,
      this.effectManager,
      this.webCameraIdDebugDetailScreen,
      this.webCameraMyStatusDebugDetailScreen
    )
    this.screenRecorder = new ScreenRecorder()
    this.effectSettingUI = new EffectSettingUI(
      this.store,
      this.effectManager,
      this.cameraVideoSender,
      this.effectSettingStore
    )
    this.cameraVideoReceiver = new VideoReceiver(
      this.webRtcPluginStore.webRtc.room,
      this.store,
      this.webCameraIdDebugDetailScreen
    )
    this.recordingIndicator = new RecordingIndicator()
  }

  private async start(): Promise<void> {
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    const ownPlayer = this.playerPluginStore.players.get(ownPlayerId)
    if (ownPlayer === undefined) throw new OwnPlayerUndefinedError()
    this.recordIconUI = new RecordIconUI(ownPlayer.role, this.store)

    // 画面録画の状態を取得して、録画中であればアイコンをアクティブにする
    await this.screenRecorder.checkRecordingStatus().then((result) => {
      if (result) {
        this.recordIconUI.recordIcon.setActive(true)
        this.recordingIndicator.show()
      }
    })
  }

  private setupDebugScreen(): void {
    const debugDetailScreenContainer = this.debugScreenPluginStore.debugDetailScreenContainer
    debugDetailScreenContainer.addSection(new DebugDetailScreenSection('webCameraInfo', 'WebCamera'))
    this.webCameraIdDebugDetailScreen = new WebCameraIdDebugDetailScreen(debugDetailScreenContainer)
    this.webCameraMyStatusDebugDetailScreen = new WebCameraMyStatusDebugDetailScreen(debugDetailScreenContainer)
  }

  private dumpDebugData(ev: DumpDebugDataEvent): void {
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    const ownParticipant = this.webRtcPluginStore.webRtc.room.getParticipantByIdentity(ownPlayerId)
    const ownCameraStatus = ownParticipant !== undefined ? String(ownParticipant.isCameraEnabled) : 'undefined'
    ev.dataDumper.dump('webCameraIsOn', ownCameraStatus)

    const cameraEnabledIds: string[] = []
    for (const id of this.playerPluginStore.players.getAllId()) {
      const participant = this.webRtcPluginStore.webRtc.room.getParticipantByIdentity(id)
      if (participant === undefined) continue
      if (!participant.isCameraEnabled) continue
      cameraEnabledIds.push(id)
    }
    const idsText = cameraEnabledIds.length > 0 ? cameraEnabledIds.join(', ') : ''
    ev.dataDumper.dump('webCameraId', `${cameraEnabledIds.length}: ${idsText}`)
  }

  private enableVideoChatButton(): void {
    this.videoChatUI.videoChatIcon.enableButton()
  }

  private async screenRecordStart(): Promise<void> {
    this.recordIconUI.recordIcon.setActive(true)
    this.recordingIndicator.show()
  }

  private async screenRecordStop(): Promise<void> {
    this.recordIconUI.recordIcon.setActive(false)
    this.recordingIndicator.hide()
  }
}
