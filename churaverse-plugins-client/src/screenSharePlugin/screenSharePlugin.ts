import { BasePlugin, IMainScene } from 'churaverse-engine-client'
import { DebugDetailScreenSection } from '../debugScreenPlugin/debugScreen/debugDetailScreenSection'
import { DumpDebugDataEvent } from '../debugScreenPlugin/event/dumpDebugDataEvent'
import { DebugScreenPluginStore } from '../debugScreenPlugin/store/defDebugScreenPluginStore'
import { IGroundScreenRenderer } from '../groundScreenPlugin/interface/IGroundScreenRenderer'
import { GroundScreenPluginStore } from '../groundScreenPlugin/store/defGroundScreenPluginStore'
import { PlayerPluginStore } from '../playerPlugin/store/defPlayerPluginStore'
import { WebRtcPluginStore } from '../webRtcPlugin/store/defWebRtcPluginStore'
import {
  IScreenShareIdDebugDetailScreen,
  IScreenShareMyStatusDebugDetailScreen,
} from './debugScreen/IDebugScreen/IScreenShareInfoDebugDetailScreen'
import { ScreenShareIdDebugDetailScreen } from './debugScreen/screenShareIdDebugDetailScreen'
import { ScreenShareMyStatusDebugDetailScreen } from './debugScreen/screenShareMyStatusDebugDetailScreen'
import { StartScreenShare } from './event/startScreenShareEvent'
import { StopScreenShare } from './event/stopScreenShareEvent'
import { ScreenShareReceiver } from './screenShareReceiver'
import { ScreenShareSender } from './screenShareSender'
import { ScreenShareUi } from './ui/screenShareUi'

export class ScreenSharePlugin extends BasePlugin<IMainScene> {
  private webRtcPluginStore!: WebRtcPluginStore
  private groundScreenPluginStore!: GroundScreenPluginStore
  private playerPluginStore!: PlayerPluginStore
  private debugScreenPluginStore!: DebugScreenPluginStore

  private screenShareUi?: ScreenShareUi
  private readonly sharedScreenRenderers: Map<string, IGroundScreenRenderer> = new Map()
  private screenShareSender?: ScreenShareSender
  private screenShareIdDebugDetailScreen!: IScreenShareIdDebugDetailScreen
  private screenShareMyStatusDebugDetailScreen!: IScreenShareMyStatusDebugDetailScreen

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))
    this.bus.subscribeEvent('startScreenShare', this.onStartScreenShare.bind(this))
    this.bus.subscribeEvent('stopScreenShare', this.onStopScreenShare.bind(this))
    this.bus.subscribeEvent('dumpDebugData', this.dumpDebugData.bind(this))
  }

  private init(): void {
    this.getStores()

    void new ScreenShareReceiver(this.webRtcPluginStore.webRtc.room, this.bus)
    this.screenShareSender = new ScreenShareSender(this.webRtcPluginStore.webRtc.room, this.bus)
    this.screenShareUi = new ScreenShareUi(this.store, this.screenShareSender)
  }

  private getStores(): void {
    this.webRtcPluginStore = this.store.of('webRtcPlugin')
    this.groundScreenPluginStore = this.store.of('groundScreenPlugin')
    this.playerPluginStore = this.store.of('playerPlugin')
    this.debugScreenPluginStore = this.store.of('debugScreenPlugin')
  }

  private start(): void {
    this.setupDebugScreen()
  }

  private setupDebugScreen(): void {
    const debugDetailScreenContainer = this.debugScreenPluginStore.debugDetailScreenContainer
    debugDetailScreenContainer.addSection(new DebugDetailScreenSection('screenShareInfo', 'ScreenShare'))
    this.screenShareIdDebugDetailScreen = new ScreenShareIdDebugDetailScreen(debugDetailScreenContainer)
    this.screenShareMyStatusDebugDetailScreen = new ScreenShareMyStatusDebugDetailScreen(debugDetailScreenContainer)
  }

  private onStartScreenShare(ev: StartScreenShare): void {
    // 既存の画面共有を停止
    if (this.sharedScreenRenderers.has(this.playerPluginStore.ownPlayerId)) {
      this.screenShareSender
        ?.stopStream()
        .then((success) => {
          if (success) {
            this.screenShareUi?.screenShareIcon.deactivate()
          }
        })
        .catch((err) => {
          throw err
        })
    }

    this.sharedScreenRenderers.set(
      ev.sharerId,
      this.groundScreenPluginStore.groundScreenRendererFactory.build(ev.video)
    )
    this.screenShareIdDebugDetailScreen.update(ev.sharerId)

    if (ev.sharerId === this.playerPluginStore.ownPlayerId) {
      this.screenShareUi?.screenShareIcon.activate()
      this.screenShareMyStatusDebugDetailScreen.update(true)
    }
  }

  private onStopScreenShare(ev: StopScreenShare): void {
    this.sharedScreenRenderers.get(ev.sharerId)?.destroy()
    this.sharedScreenRenderers.delete(ev.sharerId)
    this.screenShareIdDebugDetailScreen.update(ev.sharerId)

    if (ev.sharerId === this.playerPluginStore.ownPlayerId) {
      this.screenShareUi?.screenShareIcon.deactivate()
      this.screenShareMyStatusDebugDetailScreen.update(false)
    }
  }

  private dumpDebugData(ev: DumpDebugDataEvent): void {
    const ownPlayerId = this.playerPluginStore.ownPlayerId
    const ownParticipant = this.webRtcPluginStore.webRtc.room.getParticipantByIdentity(ownPlayerId)
    const ownScreenShareStatus =
      ownParticipant !== undefined ? String(ownParticipant.isScreenShareEnabled) : 'undefined'
    ev.dataDumper.dump('screenShareIsOn', ownScreenShareStatus)

    const screenShareEnabledIds: string[] = []
    for (const id of this.playerPluginStore.players.getAllId()) {
      const participant = this.webRtcPluginStore.webRtc.room.getParticipantByIdentity(id)
      if (participant === undefined) continue
      if (!participant.isScreenShareEnabled) continue
      screenShareEnabledIds.push(id)
    }
    const idsText = screenShareEnabledIds.length > 0 ? screenShareEnabledIds.join(', ') : ''
    ev.dataDumper.dump('screenShareId', `${screenShareEnabledIds.length}: ${idsText}`)
  }
}
