import { BasePlugin, getChuraverseConfig, IMeetingScene } from 'churaverse-engine-client'
import { Room, RoomEvent, RoomOptions, VideoPresets, Track, RemoteTrack, RemoteParticipant, Participant, DataPacket_Kind } from 'livekit-client'
import {
  MIC_TOGGLE_BUTTON_ID,
  CAMERA_TOGGLE_BUTTON_ID,
  SCREEN_SHARE_BUTTON_ID,
  MEETING_EXIT_BUTTON_ID,
  controlBarStyles,
} from './components/MeetingControlBarComponent'
import { VIDEO_GRID_ID } from './components/VideoGridComponent'
import { CHAT_INPUT_ID, CHAT_SEND_BUTTON_ID } from './components/MeetingSidebarComponent'
import { MeetingPluginStore, ChatMessage } from './store/defMeetingPluginStore'
import { initMeetingPluginStore } from './store/initMeetingPluginStore'
import { readCookie } from './utils/cookieUtils'
import { fetchLivekitToken } from './utils/fetchLivekitToken'
import { VideoGridUi } from './ui/VideoGridUi'
import { ParticipantListUi } from './ui/ParticipantListUi'
import { ChatUi } from './ui/ChatUi'

const MEETING_ROOM_NAME = 'meeting-room'

export class MeetingWebRtcPlugin extends BasePlugin<IMeetingScene> {
  private meetingPluginStore!: MeetingPluginStore
  private videoGridUi!: VideoGridUi
  private participantListUi!: ParticipantListUi
  private chatUi!: ChatUi
  private isMicEnabled: boolean = false
  private isCameraEnabled: boolean = false
  private isScreenShareEnabled: boolean = false

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))
  }

  private init(): void {
    const displayName = sessionStorage.getItem('meetingPlayerName') ?? readCookie('name') ?? ''
    const participantId = displayName !== '' ? displayName : this.generateParticipantId()
    initMeetingPluginStore(this.store, participantId, displayName)
    this.meetingPluginStore = this.store.of('meetingPlugin')
    window.addEventListener('beforeunload', () => { this.cleanup() })
  }

  private async start(): Promise<void> {
    const { participantId } = this.meetingPluginStore
    this.videoGridUi = new VideoGridUi(participantId)
    this.participantListUi = new ParticipantListUi(participantId)
    this.chatUi = new ChatUi(participantId)
    await this.waitForVideoGrid()
    await this.connectToRoom()
    this.setupUiEventHandlers()
  }

  private async waitForVideoGrid(): Promise<void> {
    await new Promise<void>((resolve) => {
      const check = (): void => {
        if (document.getElementById(VIDEO_GRID_ID) !== null) {
          resolve()
        } else {
          requestAnimationFrame(check)
        }
      }
      check()
    })
  }

  private generateParticipantId(): string {
    return `user-${Math.random().toString(36).slice(2, 10)}`
  }

  private cleanup(): void {
    if (this.meetingPluginStore.room !== undefined) {
      void this.meetingPluginStore.room.disconnect()
      this.meetingPluginStore.isConnected = false
    }
  }

  private async connectToRoom(): Promise<void> {
    const roomOptions: RoomOptions = {
      adaptiveStream: true,
      dynacast: true,
      videoCaptureDefaults: {
        resolution: VideoPresets.h720.resolution,
      },
    }

    const room = new Room(roomOptions)
    this.meetingPluginStore.room = room
    this.setupRoomEventHandlers(room)

    try {
      const token = await fetchLivekitToken(
        getChuraverseConfig().backendLivekitUrl,
        MEETING_ROOM_NAME,
        this.meetingPluginStore.participantId
      )
      const livekitUrl = getChuraverseConfig().livekitUrl
      await room.connect(livekitUrl, token)
      this.meetingPluginStore.isConnected = true

      this.videoGridUi.addParticipantTile(room.localParticipant)

      room.participants.forEach((participant: RemoteParticipant) => {
        this.videoGridUi.addParticipantTile(participant)

        participant.videoTracks.forEach((publication) => {
          if (publication.track !== undefined && publication.isSubscribed) {
            if (publication.source === Track.Source.ScreenShare) {
              this.videoGridUi.attachScreenShareTrack(publication.track, participant.identity)
            } else {
              this.videoGridUi.attachTrack(publication.track, participant.identity)
            }
          }
        })
        participant.audioTracks.forEach((publication) => {
          if (publication.track !== undefined && publication.isSubscribed) {
            this.videoGridUi.attachTrack(publication.track, participant.identity)
          }
        })
      })

      this.updateParticipantList(room)
    } catch (e) {
      console.error('[MeetingWebRtc] Failed to connect:', e)
      this.meetingPluginStore.isConnected = false
    }
  }

  private setupRoomEventHandlers(room: Room): void {
    room.on(RoomEvent.ParticipantConnected, (participant) => {
      this.videoGridUi.addParticipantTile(participant)
      this.updateParticipantList(room)
      this.sendChatHistory(room)
    })

    room.on(RoomEvent.ParticipantDisconnected, (participant) => {
      this.videoGridUi.removeParticipantTile(participant.identity)
      this.updateParticipantList(room)
    })

    room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
      if (publication.source === Track.Source.ScreenShare) {
        this.videoGridUi.attachScreenShareTrack(track, participant.identity)
      } else {
        this.videoGridUi.attachTrack(track, participant.identity)
      }
    })

    room.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
      if (publication.source === Track.Source.ScreenShare) {
        track.detach().forEach((el) => { el.remove() })
        this.videoGridUi.detachScreenShareTrack(participant.identity)
      } else {
        this.videoGridUi.detachTrack(track, participant.identity)
      }
    })

    room.on(RoomEvent.LocalTrackPublished, (publication, participant) => {
      if (publication.track !== undefined) {
        if (publication.source === Track.Source.ScreenShare) {
          this.videoGridUi.attachScreenShareTrack(publication.track, participant.identity)
        } else {
          this.videoGridUi.attachTrack(publication.track, participant.identity)
        }
      }
    })

    room.on(RoomEvent.LocalTrackUnpublished, (publication, participant) => {
      if (publication.track !== undefined) {
        if (publication.source === Track.Source.ScreenShare) {
          publication.track.detach().forEach((el) => { el.remove() })
          this.videoGridUi.detachScreenShareTrack(participant.identity)
        } else {
          this.videoGridUi.detachTrack(publication.track, participant.identity)
        }
      }
    })

    room.on(RoomEvent.DataReceived, (payload, participant) => {
      this.handleDataReceived(payload, participant, room)
    })
  }

  private handleDataReceived(payload: Uint8Array, participant: RemoteParticipant | undefined, room: Room): void {
    try {
      const decoder = new TextDecoder()
      const jsonStr = decoder.decode(payload)
      const parsed: unknown = JSON.parse(jsonStr)
      if (typeof parsed !== 'object' || parsed === null) return
      const message = parsed as Record<string, unknown>
      if (typeof message.type !== 'string' || typeof message.sender !== 'string') return

      if (message.type === 'chat_history' && Array.isArray(message.history)) {
        for (const entry of message.history) {
          if (typeof entry !== 'object' || entry === null) continue
          const h = entry as Record<string, unknown>
          if (typeof h.timestamp !== 'number' || typeof h.sender !== 'string' || typeof h.text !== 'string') continue
          const historyMsg: ChatMessage = { type: 'chat', sender: h.sender, text: h.text, timestamp: h.timestamp }
          const exists = this.meetingPluginStore.chatHistory.some(
            (m) => m.timestamp === historyMsg.timestamp && m.sender === historyMsg.sender
          )
          if (!exists) {
            this.meetingPluginStore.chatHistory.push(historyMsg)
            this.chatUi.addMessage(historyMsg.sender, historyMsg.text)
          }
        }
      } else if (message.type === 'chat' && typeof message.text === 'string' && participant !== undefined) {
        const chatMsg: ChatMessage = {
          type: 'chat',
          sender: message.sender as string,
          text: message.text,
          timestamp: typeof message.timestamp === 'number' ? message.timestamp : Date.now(),
        }
        this.meetingPluginStore.chatHistory.push(chatMsg)
        this.chatUi.addMessage(participant.identity, chatMsg.text)
      }
    } catch (e) {
      console.error('[MeetingWebRtc] Failed to parse chat message:', e)
    }
  }

  private updateParticipantList(room: Room): void {
    const participants: Participant[] = [room.localParticipant]
    room.participants.forEach((p: Participant) => {
      if (p !== room.localParticipant) participants.push(p)
    })
    this.participantListUi.update(participants)
  }

  private setupUiEventHandlers(): void {
    const room = this.meetingPluginStore.room
    if (room === undefined) return

    const micButton = document.getElementById(MIC_TOGGLE_BUTTON_ID)
    const cameraButton = document.getElementById(CAMERA_TOGGLE_BUTTON_ID)
    const screenShareButton = document.getElementById(SCREEN_SHARE_BUTTON_ID)
    const exitButton = document.getElementById(MEETING_EXIT_BUTTON_ID)

    micButton?.addEventListener('click', () => { void this.toggleMicrophone(room) })
    cameraButton?.addEventListener('click', () => { void this.toggleCamera(room) })
    screenShareButton?.addEventListener('click', () => { void this.toggleScreenShare(room) })
    exitButton?.addEventListener('click', () => { this.exitMeeting() })

    const chatInput = document.getElementById(CHAT_INPUT_ID) as HTMLInputElement | null
    const chatSendButton = document.getElementById(CHAT_SEND_BUTTON_ID)

    chatSendButton?.addEventListener('click', () => {
      if (chatInput !== null && chatInput.value.trim() !== '') {
        void this.sendChatMessage(room, chatInput.value.trim())
        chatInput.value = ''
      }
    })

    chatInput?.addEventListener('keydown', (e) => {
      if (chatInput === null) return
      if (e.key === 'Enter' && !e.shiftKey && chatInput.value.trim() !== '') {
        e.preventDefault()
        void this.sendChatMessage(room, chatInput.value.trim())
        chatInput.value = ''
      }
    })
  }

  private exitMeeting(): void {
    this.cleanup()
    window.location.href = '/'
  }

  private async toggleMicrophone(room: Room): Promise<void> {
    if (!this.meetingPluginStore.isConnected) return
    this.isMicEnabled = !this.isMicEnabled
    await room.localParticipant.setMicrophoneEnabled(this.isMicEnabled)
    this.updateButtonState(MIC_TOGGLE_BUTTON_ID, !this.isMicEnabled)
  }

  private async toggleCamera(room: Room): Promise<void> {
    if (!this.meetingPluginStore.isConnected) return
    this.isCameraEnabled = !this.isCameraEnabled
    await room.localParticipant.setCameraEnabled(this.isCameraEnabled)
    this.updateButtonState(CAMERA_TOGGLE_BUTTON_ID, !this.isCameraEnabled)
  }

  private async toggleScreenShare(room: Room): Promise<void> {
    if (!this.meetingPluginStore.isConnected) return
    this.isScreenShareEnabled = !this.isScreenShareEnabled
    try {
      await room.localParticipant.setScreenShareEnabled(this.isScreenShareEnabled)
      this.updateButtonState(SCREEN_SHARE_BUTTON_ID, this.isScreenShareEnabled)
    } catch (e) {
      console.error('[MeetingWebRtc] Screen share failed:', e)
      this.isScreenShareEnabled = false
      this.updateButtonState(SCREEN_SHARE_BUTTON_ID, false)
    }
  }

  private updateButtonState(buttonId: string, highlighted: boolean): void {
    const button = document.getElementById(buttonId)
    if (button === null) return
    if (highlighted) {
      button.classList.add(controlBarStyles.activeButton)
    } else {
      button.classList.remove(controlBarStyles.activeButton)
    }
  }

  private async sendChatMessage(room: Room, text: string): Promise<void> {
    if (!this.meetingPluginStore.isConnected) return

    const message: ChatMessage = {
      type: 'chat',
      sender: this.meetingPluginStore.participantId,
      text,
      timestamp: Date.now(),
    }

    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(JSON.stringify(message))
      await room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE)
      this.meetingPluginStore.chatHistory.push(message)
      this.chatUi.addMessage(this.meetingPluginStore.participantId, text)
    } catch (e) {
      console.error('[MeetingWebRtc] Failed to send chat message:', e)
    }
  }

  private sendChatHistory(room: Room): void {
    if (!this.meetingPluginStore.isConnected || this.meetingPluginStore.chatHistory.length === 0) return

    const historyMessage: ChatMessage = {
      type: 'chat_history',
      sender: this.meetingPluginStore.participantId,
      text: '',
      timestamp: Date.now(),
      history: this.meetingPluginStore.chatHistory,
    }

    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(JSON.stringify(historyMessage))
      void room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE)
    } catch (e) {
      console.error('[MeetingWebRtc] Failed to send chat history:', e)
    }
  }
}
