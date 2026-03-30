import { BasePlugin, DomManager, IMeetingScene } from 'churaverse-engine-client'
import { Room, RoomEvent, Track, RemoteParticipant, Participant, TrackPublication } from 'livekit-client'
import {
  MIC_TOGGLE_BUTTON_ID,
  CAMERA_TOGGLE_BUTTON_ID,
  SCREEN_SHARE_BUTTON_ID,
  MEETING_EXIT_BUTTON_ID,
  controlBarStyles,
} from './components/MeetingControlBarComponent'
import { VIDEO_GRID_ID } from './components/VideoGridComponent'
import { CHAT_INPUT_ID, CHAT_SEND_BUTTON_ID } from './components/MeetingSidebarComponent'
import { MeetingPluginStore } from './store/defMeetingPluginStore'
import { initMeetingPluginStore } from './store/initMeetingPluginStore'
import { VideoGridUi } from './ui/videoGridUi'
import { ParticipantListUi } from './ui/participantListUi'
import { ChatUi } from './ui/chatUi'
import { MeetingRoom } from './meetingRoom'
import { LiveKitChatService } from '../../webRtcPlugin/livekit'
import '@churaverse/transition-plugin-client/store/defTransitionPluginStore'

export class MeetingSessionPlugin extends BasePlugin<IMeetingScene> {
  private meetingPluginStore!: MeetingPluginStore
  private videoGridUi!: VideoGridUi
  private participantListUi!: ParticipantListUi
  private chatUi!: ChatUi
  private chatService!: LiveKitChatService
  private isMicEnabled: boolean = false
  private isCameraEnabled: boolean = false
  private isScreenShareEnabled: boolean = false

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))
  }

  private init(): void {
    const receivedData = this.store.of('transitionPlugin').transitionManager.getReceivedData() as unknown as
      | { ownPlayer?: { name?: string } }
      | undefined
    const displayName = (receivedData?.ownPlayer?.name ?? '').trim()
    const participantId = this.generateParticipantId()
    initMeetingPluginStore(this.store, participantId, displayName !== '' ? displayName : participantId)
    this.meetingPluginStore = this.store.of('meetingPlugin')
    window.addEventListener('beforeunload', () => {
      this.cleanup()
    })
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
    if (globalThis.crypto?.randomUUID !== undefined) {
      return `meeting-${globalThis.crypto.randomUUID()}`
    }
    return `meeting-${Math.random().toString(36).slice(2, 10)}`
  }

  private cleanup(): void {
    const meetingRoom = this.meetingPluginStore.meetingRoom
    if (meetingRoom !== undefined) {
      void meetingRoom.disconnect()
      this.meetingPluginStore.isConnected = false
    }
  }

  private async connectToRoom(): Promise<void> {
    const meetingRoom = new MeetingRoom()
    this.meetingPluginStore.meetingRoom = meetingRoom
    const { room } = meetingRoom
    this.setupRoomEventHandlers(meetingRoom)

    this.chatService = new LiveKitChatService(room, this.meetingPluginStore.participantId, this.meetingPluginStore.displayName)
    this.chatService.setHandler({
      onChatMessage: (senderId, senderName, text) => {
        this.chatUi.addMessage(senderId, senderName, text)
      },
    })

    try {
      await meetingRoom.connect(this.meetingPluginStore.participantId, this.meetingPluginStore.displayName)
      this.meetingPluginStore.isConnected = true

      this.videoGridUi.addParticipantTile(room.localParticipant)

      room.participants.forEach((participant: RemoteParticipant) => {
        this.videoGridUi.addParticipantTile(participant)

        participant.videoTracks.forEach((publication) => {
          if (publication.track !== undefined && publication.isSubscribed) {
            this.handleTrackAttachment(publication.track, publication, participant)
          }
        })
        participant.audioTracks.forEach((publication) => {
          if (publication.track !== undefined && publication.isSubscribed) {
            this.videoGridUi.attachTrack(publication.track, participant.identity)
          }
        })
      })

      this.updateParticipantList(meetingRoom)
    } catch (e) {
      console.error('[MeetingWebRtc] Failed to connect:', e)
      this.meetingPluginStore.isConnected = false
    }
  }

  private setupRoomEventHandlers(meetingRoom: MeetingRoom): void {
    const { room } = meetingRoom

    room.on(RoomEvent.ParticipantConnected, (participant) => {
      this.videoGridUi.addParticipantTile(participant)
      this.updateParticipantList(meetingRoom)
    })

    room.on(RoomEvent.ParticipantNameChanged, (_name, participant) => {
      this.videoGridUi.updateParticipantName(participant.identity, participant.name ?? participant.identity)
      this.updateParticipantList(meetingRoom)
    })

    room.on(RoomEvent.ParticipantDisconnected, (participant) => {
      this.videoGridUi.removeParticipantTile(participant.identity)
      this.updateParticipantList(meetingRoom)
    })

    room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
      this.handleTrackAttachment(track, publication, participant)
    })

    room.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
      this.handleTrackDetachment(track, publication, participant.identity)
    })

    room.on(RoomEvent.TrackMuted, () => {
      this.updateParticipantList(meetingRoom)
    })

    room.on(RoomEvent.TrackUnmuted, () => {
      this.updateParticipantList(meetingRoom)
    })

    room.on(RoomEvent.LocalTrackPublished, (publication, participant) => {
      if (publication.track !== undefined && publication.source !== Track.Source.Microphone) {
        this.handleTrackAttachment(publication.track, publication, participant)
      }
      this.updateParticipantList(meetingRoom)
    })

    room.on(RoomEvent.LocalTrackUnpublished, (publication, participant) => {
      if (publication.track !== undefined) {
        this.handleTrackDetachment(publication.track, publication, participant.identity)
      }
      if (publication.source === Track.Source.ScreenShare) {
        this.isScreenShareEnabled = false
        this.updateButtonState(SCREEN_SHARE_BUTTON_ID, false)
      }
      this.updateParticipantList(meetingRoom)
    })
  }

  private handleTrackAttachment(track: Track, publication: TrackPublication, participant: Participant): void {
    if (publication.source === Track.Source.ScreenShare) {
      this.videoGridUi.attachScreenShareTrack(track, participant.identity, participant.name ?? participant.identity)
    } else {
      this.videoGridUi.attachTrack(track, participant.identity)
    }
  }

  private handleTrackDetachment(track: Track, publication: TrackPublication, participantIdentity: string): void {
    if (publication.source === Track.Source.ScreenShare) {
      track.detach().forEach((el) => {
        el.remove()
      })
      this.videoGridUi.detachScreenShareTrack(participantIdentity)
    } else {
      this.videoGridUi.detachTrack(track, participantIdentity)
    }
  }

  private updateParticipantList(meetingRoom: MeetingRoom): void {
    const { room } = meetingRoom
    const participants: Participant[] = [room.localParticipant]
    room.participants.forEach((p: Participant) => {
      if (p !== room.localParticipant) participants.push(p)
    })
    this.participantListUi.update(participants)
  }

  private setupUiEventHandlers(): void {
    const meetingRoom = this.meetingPluginStore.meetingRoom
    if (meetingRoom === undefined) return
    const { room } = meetingRoom

    const micButton = DomManager.getElementById(MIC_TOGGLE_BUTTON_ID)
    const cameraButton = DomManager.getElementById(CAMERA_TOGGLE_BUTTON_ID)
    const screenShareButton = DomManager.getElementById(SCREEN_SHARE_BUTTON_ID)
    const exitButton = DomManager.getElementById(MEETING_EXIT_BUTTON_ID)

    micButton.addEventListener('click', () => {
      void this.toggleMicrophone(room)
    })
    cameraButton.addEventListener('click', () => {
      void this.toggleCamera(room)
    })
    screenShareButton.addEventListener('click', () => {
      void this.toggleScreenShare(room)
    })
    exitButton.addEventListener('click', () => {
      this.exitMeeting()
    })

    const chatInput = DomManager.getElementById<HTMLInputElement>(CHAT_INPUT_ID)
    const chatSendButton = DomManager.getElementById(CHAT_SEND_BUTTON_ID)

    chatSendButton.addEventListener('click', () => {
      if (chatInput.value.trim() !== '') {
        void this.chatService.sendChat(chatInput.value.trim())
        chatInput.value = ''
      }
    })

    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && chatInput.value.trim() !== '') {
        e.preventDefault()
        void this.chatService.sendChat(chatInput.value.trim())
        chatInput.value = ''
      }
    })
  }

  private exitMeeting(): void {
    this.cleanup()
    DomManager.removeAll()
    this.store.of('transitionPlugin').transitionManager.transitionTo('TitleScene')
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
    const button = DomManager.getElementById(buttonId)
    if (highlighted) {
      button.classList.add(controlBarStyles.activeButton)
    } else {
      button.classList.remove(controlBarStyles.activeButton)
    }
  }
}
