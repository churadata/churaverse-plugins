import { Scene } from 'phaser'
import { StartEvent, IMainScene, BasePlugin, PhaserSceneInit } from 'churaverse-engine-client'
import { WebRtcPluginStore } from '@churaverse/web-rtc-plugin-client/store/defWebRtcPluginStore'
import { CameraVideoSender } from './cameraVideoSender'
import { VideoChatUI } from './ui/videoChatUi'
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
import { DumpDebugDataEvent } from '@churaverse/debug-screen-plugin-client/event/dumpDebugDataEvent'

export class CameraVideoChatPlugin extends BasePlugin<IMainScene> {
  private scene?: Scene
  private webRtcPluginStore!: WebRtcPluginStore
  private playerPluginStore!: PlayerPluginStore
  private debugScreenPluginStore!: DebugScreenPluginStore
  private cameraVideoSender!: CameraVideoSender
  private videoChatUI!: VideoChatUI
  private cameraVideoReceiver!: VideoReceiver
  private webCameraIdDebugDetailScreen!: IWebCameraIdDebugDetailScreen
  private webCameraMyStatusDebugDetailScreen!: IWebCameraMyStatusDebugDetailScreen

  public listenEvent(): void {
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))
    this.bus.subscribeEvent('triggerVideoSending', this.triggerVideoSending.bind(this))
    this.bus.subscribeEvent('dumpDebugData', this.dumpDebugData.bind(this))
  }

  private triggerVideoSending(ev: TriggerVideoSendingEvent): void {
    this.cameraVideoSender.handleVideoSendTrigger(ev)
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.scene = ev.scene
  }

  private init(): void {
    this.webRtcPluginStore = this.store.of('webRtcPlugin')
    this.playerPluginStore = this.store.of('playerPlugin')
    this.debugScreenPluginStore = this.store.of('debugScreenPlugin')
    this.setupDebugScreen()
    this.cameraVideoSender = new CameraVideoSender(this.webRtcPluginStore.webRtc.room, this.store, this.webCameraIdDebugDetailScreen, this.webCameraMyStatusDebugDetailScreen)
    this.cameraVideoReceiver = new VideoReceiver(this.webRtcPluginStore.webRtc.room, this.store, this.webCameraIdDebugDetailScreen)
  }

  private start(ev: StartEvent): void {
    this.videoChatUI = new VideoChatUI(this.store, this.bus)
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
}
