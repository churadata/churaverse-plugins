import { BasePlugin, DomManager, IMeetingScene, ITitleScene } from 'churaverse-engine-client'
import { Room, RoomEvent, Track, RemoteParticipant, Participant, TrackPublication, DataPacket_Kind } from 'livekit-client'
import {
  MIC_TOGGLE_BUTTON_ID,
  CAMERA_TOGGLE_BUTTON_ID,
  SCREEN_SHARE_BUTTON_ID,
  MEETING_EXIT_BUTTON_ID,
  PORTAL_BUTTON_ID,
  REACTION_SHARK_BUTTON_ID,
  REACTION_BOMB_BUTTON_ID,
  controlBarStyles,
} from './components/MeetingControlBarComponent'
import sharkSprite from './assets/shark.png'
import bombSprite from './assets/bomb_large_explosion.png'
import { VIDEO_GRID_ID } from './components/VideoGridComponent'
import { CHAT_INPUT_ID, CHAT_SEND_BUTTON_ID } from './components/MeetingSidebarComponent'
import { MeetingPluginStore } from './store/defMeetingPluginStore'
import { initMeetingPluginStore } from './store/initMeetingPluginStore'
import { VideoGridUi } from './ui/videoGridUi'
import { ParticipantListUi } from './ui/participantListUi'
import { ChatUi } from './ui/chatUi'
import { MeetingRoom } from './meetingRoom'
import { getParticipantDisplayName } from '@churaverse/livekit-client'
import { LiveKitChatService } from '@churaverse/livekit-client'
import { PORTAL_STORAGE_KEYS } from '@churaverse/transition-plugin-client'
import '@churaverse/transition-plugin-client/store/defTransitionPluginStore'
import '@churaverse/title-plugin-client/titlePlayerPlugin/defTitlePlayerTransitionData'

export class MeetingWebRtcPlugin extends BasePlugin<IMeetingScene> {
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
    const receivedData = this.store.of('transitionPlugin').transitionManager.getReceivedData<ITitleScene>()
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
    const TIMEOUT_MS = 5000
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('video-grid element not found within timeout')), TIMEOUT_MS)
      const check = (): void => {
        if (document.getElementById(VIDEO_GRID_ID) !== null) {
          clearTimeout(timer)
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

    this.chatService = new LiveKitChatService(
      room,
      this.meetingPluginStore.participantId,
      this.meetingPluginStore.displayName
    )
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
      this.videoGridUi.updateParticipantName(participant.identity, getParticipantDisplayName(participant))
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

    room.on(RoomEvent.DataReceived, (payload) => {
      try {
        const message = JSON.parse(new TextDecoder().decode(payload)) as { type?: string; reactionType?: string }
        if (message.type === 'reaction' && typeof message.reactionType === 'string') {
          this.showReactionAnimation(message.reactionType as 'shark' | 'bomb')
        }
      } catch {
        // chat等の他メッセージは無視
      }
    })
  }

  private handleTrackAttachment(track: Track, publication: TrackPublication, participant: Participant): void {
    if (publication.source === Track.Source.ScreenShare) {
      this.videoGridUi.attachScreenShareTrack(track, participant.identity, getParticipantDisplayName(participant))
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

    const portalButton = DomManager.getElementById(PORTAL_BUTTON_ID)
    portalButton.addEventListener('click', () => {
      this.enterGameMode()
    })

    const sharkButton = DomManager.getElementById(REACTION_SHARK_BUTTON_ID)
    sharkButton.addEventListener('click', () => {
      void this.sendReaction(room, 'shark')
    })

    const bombButton = DomManager.getElementById(REACTION_BOMB_BUTTON_ID)
    bombButton.addEventListener('click', () => {
      void this.sendReaction(room, 'bomb')
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

  private async sendReaction(room: Room, reactionType: 'shark' | 'bomb'): Promise<void> {
    if (!this.meetingPluginStore.isConnected) return
    const message = { type: 'reaction', reactionType }
    const data = new TextEncoder().encode(JSON.stringify(message))
    await room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE)
    this.showReactionAnimation(reactionType)
  }

  private async enterGameMode(): Promise<void> {
    sessionStorage.setItem(PORTAL_STORAGE_KEYS.TO_GAME_MODE, 'true')
    sessionStorage.setItem(PORTAL_STORAGE_KEYS.PLAYER_NAME, this.meetingPluginStore.displayName)
    await this.meetingPluginStore.meetingRoom?.disconnect()
    this.meetingPluginStore.isConnected = false
    window.location.href = '/'
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

  private showReactionAnimation(type: 'shark' | 'bomb'): void {
    const container = document.querySelector('[class*="mainArea"]') as HTMLElement
    if (container === null) return
    if (type === 'shark') {
      this.showSharkAnimation(container)
    } else {
      this.showBombAnimation(container)
    }
  }

  private showSharkAnimation(container: HTMLElement): void {
    const shark = document.createElement('div')
    const size = 120
    const startY = Math.random() * Math.max(container.clientHeight - size - 200, 100) + 50
    shark.style.cssText = `position:absolute;width:${size}px;height:${size}px;left:-${size}px;top:${startY}px;z-index:100;image-rendering:pixelated;background-image:url(${sharkSprite});background-size:${size * 2}px ${size * 4}px;background-repeat:no-repeat;background-position:0px -${size * 2}px;pointer-events:none;`
    container.appendChild(shark)

    let frame = 0
    let x = -size
    let lastFrameTime = 0
    const animate = (timestamp: number): void => {
      if (lastFrameTime === 0) lastFrameTime = timestamp
      if (timestamp - lastFrameTime > 125) {
        frame = frame === 0 ? 1 : 0
        shark.style.backgroundPosition = `${-frame * size}px ${-size * 2}px`
        lastFrameTime = timestamp
      }
      x += 5
      shark.style.left = `${x}px`
      if (x > container.clientWidth + size) {
        shark.remove()
        return
      }
      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }

  private showBombAnimation(container: HTMLElement): void {
    const bomb = document.createElement('div')
    const size = 100
    const centerX = Math.random() * (container.clientWidth - size)
    const centerY = Math.random() * (container.clientHeight - size)
    bomb.style.cssText = `position:absolute;width:${size}px;height:${size}px;left:${centerX}px;top:${centerY}px;z-index:100;image-rendering:pixelated;background-image:url(${bombSprite});background-size:${size * 3}px ${size * 4}px;background-repeat:no-repeat;background-position:0 0;pointer-events:none;`
    container.appendChild(bomb)

    let frame = 0
    const totalFrames = 12
    let lastFrameTime = 0
    const animate = (timestamp: number): void => {
      if (lastFrameTime === 0) lastFrameTime = timestamp
      if (timestamp - lastFrameTime > 100) {
        const col = frame % 3
        const row = Math.floor(frame / 3)
        bomb.style.backgroundPosition = `${-col * size}px ${-row * size}px`
        frame++
        lastFrameTime = timestamp
      }
      if (frame >= totalFrames) {
        bomb.remove()
        return
      }
      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
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
