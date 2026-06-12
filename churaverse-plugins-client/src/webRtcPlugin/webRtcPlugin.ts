import { BasePlugin, IMainScene, ITitleScene } from 'churaverse-engine-client'
import { ChangeLocalDeviceEvent } from './event/changeLocalDeviceEvent'
import { WebRtcPluginStore } from './store/defWebRtcPluginStore'
import { initWebRtcPluginStore } from './store/initWebRtcPluginStore'
import { WebRtcUi } from './ui/webRtcUi'
import { LiveKitChatService, MEETING_PARTICIPANT_ID_PREFIX } from '@churaverse/livekit-client'
import { MeetingParticipantPanel } from './ui/meetingParticipantPanel/meetingParticipantPanel'
import { TextChat } from '@churaverse/text-chat-plugin-client/model/textChat'
import { AddTextChatEvent } from '@churaverse/text-chat-plugin-client/event/addTextChatEvent'
import { SendTextChatEvent } from '@churaverse/text-chat-plugin-client/event/sendTextChatEvent'
import '@churaverse/transition-plugin-client/event/willSceneTransitionEvent'
import '@churaverse/transition-plugin-client/store/defTransitionPluginStore'
import '@churaverse/title-plugin-client/titlePlayerPlugin/defTitlePlayerTransitionData'

export class WebRtcPlugin extends BasePlugin<IMainScene> {
  private webRtcPluginStore!: WebRtcPluginStore
  private webRtcUi?: WebRtcUi
  private chatService?: LiveKitChatService

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))
    this.bus.subscribeEvent('willSceneTransition', this.willSceneTransition.bind(this))
    this.bus.subscribeEvent('changeLocalDevice', this.onChangeLocalDevice.bind(this))
    this.bus.subscribeEvent('sendTextChat', this.onSendTextChat.bind(this))
  }

  private init(): void {
    initWebRtcPluginStore(this.store)
    this.webRtcPluginStore = this.store.of('webRtcPlugin')
    window.addEventListener('beforeunload', () => {
      void this.webRtcPluginStore.webRtc.disconnect()
    })
  }

  private start(): void {
    this.webRtcUi = new WebRtcUi(this.store, this.bus)
    this.setupChatBridge()
    void new MeetingParticipantPanel(this.webRtcPluginStore.webRtc.room)

    navigator.mediaDevices.addEventListener('devicechange', () => {
      this.bus.post(new ChangeLocalDeviceEvent())
    })
  }

  private setupChatBridge(): void {
    const room = this.webRtcPluginStore.webRtc.room
    const transitionStore = this.store.of('transitionPlugin')
    const receivedData = transitionStore.transitionManager.getReceivedData<ITitleScene>()
    const ownPlayerName = receivedData?.ownPlayer?.name ?? room.localParticipant.identity

    this.chatService = new LiveKitChatService(room, room.localParticipant.identity, ownPlayerName)
    this.chatService.setHandler({
      onChatMessage: (senderId, senderName, text) => {
        // MeetingScene 参加者以外は Socket 経由で既に扱うためスキップ（identity は MEETING_PARTICIPANT_ID_PREFIX）
        if (!senderId.startsWith(MEETING_PARTICIPANT_ID_PREFIX)) return

        const textChat = new TextChat(senderId, senderName, text)
        this.bus.post(new AddTextChatEvent(textChat))
      },
    })
  }

  private onSendTextChat(ev: SendTextChatEvent): void {
    const room = this.webRtcPluginStore.webRtc.room
    if (room.state !== 'connected') return
    void this.chatService?.sendChat(ev.textChat.message)
  }

  private willSceneTransition(): void {
    void this.webRtcPluginStore.webRtc.disconnect()
  }

  private onChangeLocalDevice(): void {
    void this.updateSelectors()
  }

  // prettier-ignore
  private async updateSelectors(): Promise<void> {
    void this.webRtcUi?.cameraSelector.updateLocalDevices(await this.webRtcPluginStore.localCameraManager.getDevices())
    void this.webRtcUi?.micSelector.updateLocalDevices(await this.webRtcPluginStore.localMicrophoneManager.getDevices())
    void this.webRtcUi?.speakerSelector.updateLocalDevices(await this.webRtcPluginStore.localSpeakerManager.getDevices())
  }
}
