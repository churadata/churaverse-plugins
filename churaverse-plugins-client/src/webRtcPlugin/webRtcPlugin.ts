import { BasePlugin, IMainScene } from 'churaverse-engine-client'
import { RoomEvent, DataPacket_Kind } from 'livekit-client'
import { ChangeLocalDeviceEvent } from './event/changeLocalDeviceEvent'
import { WebRtcPluginStore } from './store/defWebRtcPluginStore'
import { initWebRtcPluginStore } from './store/initWebRtcPluginStore'
import { WebRtcUi } from './ui/webRtcUi'
import { MeetingParticipantPanel } from './ui/meetingParticipantPanel/meetingParticipantPanel'
import { TextChat } from '@churaverse/text-chat-plugin-client/model/textChat'
import { AddTextChatEvent } from '@churaverse/text-chat-plugin-client/event/addTextChatEvent'
import { SendTextChatEvent } from '@churaverse/text-chat-plugin-client/event/sendTextChatEvent'
import '@churaverse/transition-plugin-client/event/willSceneTransitionEvent'

export class WebRtcPlugin extends BasePlugin<IMainScene> {
  private webRtcPluginStore!: WebRtcPluginStore
  private webRtcUi?: WebRtcUi
  private meetingParticipantPanel?: MeetingParticipantPanel

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
  }

  private start(): void {
    this.webRtcUi = new WebRtcUi(this.store, this.bus)
    this.meetingParticipantPanel = new MeetingParticipantPanel(this.webRtcPluginStore.webRtc.room)
    this.setupChatBridge()

    navigator.mediaDevices.addEventListener('devicechange', () => {
      this.bus.post(new ChangeLocalDeviceEvent())
    })
  }

  /**
   * LiveKit data channelとTextChatの双方向ブリッジ
   */
  private setupChatBridge(): void {
    const room = this.webRtcPluginStore.webRtc.room
    console.log('[ChatBridge] setupChatBridge called, room state:', room.state)
    room.on(RoomEvent.DataReceived, (payload, participant) => {
      console.log('[ChatBridge] DataReceived, participant:', participant?.identity)
      if (participant === undefined) return
      try {
        const message = JSON.parse(new TextDecoder().decode(payload)) as { type: string; text?: string }
        console.log('[ChatBridge] message type:', message.type, 'text:', message.text)
        if (message.type !== 'chat' || typeof message.text !== 'string') return

        // ゲームプレイヤーからのチャットはsocket.io経由で受信するためスキップ
        const isGamePlayer = document.getElementById(`player-${participant.identity}`) !== null
        console.log('[ChatBridge] isGamePlayer:', isGamePlayer, 'identity:', participant.identity)
        if (isGamePlayer) return

        const displayName = this.meetingParticipantPanel?.getDisplayName(participant) ?? participant.identity
        console.log('[ChatBridge] posting AddTextChatEvent, displayName:', displayName)
        const textChat = new TextChat(participant.identity, displayName, message.text)
        this.bus.post(new AddTextChatEvent(textChat))
      } catch (e) {
        console.error('[ChatBridge] error:', e)
      }
    })
  }

  /**
   * TextChatの送信をLiveKit data channelにも転送
   */
  private onSendTextChat(ev: SendTextChatEvent): void {
    const room = this.webRtcPluginStore.webRtc.room
    console.log('[ChatBridge] onSendTextChat, room state:', room.state, 'message:', ev.textChat.message)
    if (room.state !== 'connected') return

    const message = {
      type: 'chat',
      sender: room.localParticipant.identity,
      text: ev.textChat.message,
      timestamp: Date.now(),
    }
    const data = new TextEncoder().encode(JSON.stringify(message))
    void room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE)
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
