import { BasePlugin, DomManager, getChuraverseConfig, IMeetingScene } from 'churaverse-engine-client'
import { Room, RoomEvent, RoomOptions, VideoPresets, Track, RemoteTrack, RemoteParticipant, Participant, DataPacket_Kind } from 'livekit-client'
import { videoGridStyles } from './components/VideoGridComponent'
import { controlBarStyles } from './components/MeetingControlBarComponent'
import { sidebarStyles } from './components/MeetingSidebarComponent'

interface AccessTokenResponse {
  token: string
}

interface ChatMessage {
  type: 'chat' | 'chat_history'
  sender: string
  text: string
  timestamp: number
  history?: ChatMessage[]
}

export class MeetingWebRtcPlugin extends BasePlugin<IMeetingScene> {
  private room?: Room
  private participantId: string = ''
  private displayName: string = ''
  private isMicEnabled: boolean = false
  private isCameraEnabled: boolean = false
  private isScreenShareEnabled: boolean = false
  private isConnected: boolean = false
  private chatHistory: ChatMessage[] = []
  private participantNames: Map<string, string> = new Map()

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))
  }

  private init(): void {
    this.displayName = sessionStorage.getItem('meetingPlayerName') ?? this.readCookie('name') ?? ''
    this.participantId = this.displayName !== '' ? this.displayName : this.generateParticipantId()
    this.participantNames.set(this.participantId, this.displayName !== '' ? this.displayName : this.participantId)
    window.addEventListener('beforeunload', () => this.cleanup())
  }

  private readCookie(property: string): string | undefined {
    const savedInfos = document.cookie.split(';')
    for (const savedInfo of savedInfos) {
      const [key, value] = savedInfo.trim().split('=')
      if (key === property) {
        return decodeURIComponent(value)
      }
    }
    return undefined
  }

  private async start(): Promise<void> {
    await this.waitForVideoGrid()
    await this.connectToRoom(this.participantId)
    this.setupUiEventHandlers()
  }

  private async waitForVideoGrid(): Promise<void> {
    return await new Promise((resolve) => {
      const check = (): void => {
        if (document.getElementById('video-grid') !== null) {
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
    if (this.room !== undefined) {
      void this.room.disconnect()
      this.isConnected = false
    }
  }

  private async connectToRoom(playerId: string): Promise<void> {
    const roomOptions: RoomOptions = {
      adaptiveStream: true,
      dynacast: true,
      videoCaptureDefaults: {
        resolution: VideoPresets.h720.resolution,
      },
    }

    this.room = new Room(roomOptions)
    this.setupRoomEventHandlers()

    try {
      const token = await this.getAccessToken(playerId)
      const livekitUrl = getChuraverseConfig().livekitUrl
      console.log(`[MeetingWebRtc] Connecting to ${livekitUrl}`)
      await this.room.connect(livekitUrl, token)
      this.isConnected = true
      console.log(`[MeetingWebRtc] Connected to room: ${this.room.name}`)

      this.addParticipantTile(this.room.localParticipant)

      this.room.participants.forEach((participant: RemoteParticipant) => {
        console.log(`[MeetingWebRtc] Adding existing participant: ${participant.identity}`)
        this.addParticipantTile(participant)

        participant.videoTracks.forEach((publication) => {
          if (publication.track !== undefined && publication.isSubscribed) {
            this.attachTrack(publication.track, participant.identity)
          }
        })
        participant.audioTracks.forEach((publication) => {
          if (publication.track !== undefined && publication.isSubscribed) {
            this.attachTrack(publication.track, participant.identity)
          }
        })
      })
    } catch (e) {
      console.error('[MeetingWebRtc] Failed to connect:', e)
      this.isConnected = false
    }
  }

  private setupRoomEventHandlers(): void {
    if (this.room === undefined) return

    this.room.on(RoomEvent.ParticipantConnected, (participant) => {
      console.log(`[MeetingWebRtc] Participant connected: ${participant.identity}`)
      this.addParticipantTile(participant)
      this.sendChatHistory()
    })

    this.room.on(RoomEvent.ParticipantDisconnected, (participant) => {
      console.log(`[MeetingWebRtc] Participant disconnected: ${participant.identity}`)
      this.removeParticipantTile(participant.identity)
    })

    this.room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
      console.log(`[MeetingWebRtc] Track subscribed: ${track.kind} (source: ${publication.source}) from ${participant.identity}`)
      if (publication.source === Track.Source.ScreenShare) {
        this.attachScreenShareTrack(track, participant.identity)
      } else {
        this.attachTrack(track, participant.identity)
      }
    })

    this.room.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
      console.log(`[MeetingWebRtc] Track unsubscribed: ${track.kind} (source: ${publication.source}) from ${participant.identity}`)
      if (publication.source === Track.Source.ScreenShare) {
        this.detachScreenShareTrack(participant.identity)
      } else {
        this.detachTrack(track, participant.identity)
      }
    })

    this.room.on(RoomEvent.LocalTrackPublished, (publication, participant) => {
      console.log(`[MeetingWebRtc] Local track published: ${publication.kind} (source: ${publication.source})`)
      if (publication.track !== undefined) {
        if (publication.source === Track.Source.ScreenShare) {
          this.attachScreenShareTrack(publication.track, participant.identity)
        } else {
          this.attachTrack(publication.track, participant.identity)
        }
      }
    })

    this.room.on(RoomEvent.LocalTrackUnpublished, (publication, participant) => {
      console.log(`[MeetingWebRtc] Local track unpublished: ${publication.kind} (source: ${publication.source})`)
      if (publication.track !== undefined) {
        if (publication.source === Track.Source.ScreenShare) {
          this.detachScreenShareTrack(participant.identity)
        } else {
          this.detachTrack(publication.track, participant.identity)
        }
      }
    })

    this.room.on(RoomEvent.DataReceived, (payload, participant) => {
      try {
        const decoder = new TextDecoder()
        const jsonStr = decoder.decode(payload)
        const message = JSON.parse(jsonStr) as ChatMessage

        if (message.type === 'chat_history' && message.history !== undefined) {
          message.history.forEach((historyMsg) => {
            const exists = this.chatHistory.some((m) => m.timestamp === historyMsg.timestamp && m.sender === historyMsg.sender)
            if (!exists) {
              this.chatHistory.push(historyMsg)
              this.addChatMessage(historyMsg.sender, historyMsg.text)
            }
          })
        } else if (message.type === 'chat' && message.text !== undefined && participant !== undefined) {
          this.chatHistory.push(message)
          this.addChatMessage(participant.identity, message.text)
        }
      } catch (e) {
        console.error('[MeetingWebRtc] Failed to parse chat message:', e)
      }
    })
  }

  private addParticipantTile(participant: Participant): void {
    const grid = document.getElementById('video-grid')
    if (grid === null) {
      console.error('[MeetingWebRtc] video-grid element not found!')
      return
    }

    const existingTile = document.getElementById(`tile-${participant.identity}`)
    if (existingTile !== null) {
      return
    }

    const tile = document.createElement('div')
    tile.id = `tile-${participant.identity}`
    tile.className = videoGridStyles.participantTile

    const videoArea = document.createElement('div')
    videoArea.className = videoGridStyles.videoArea

    const videoContainer = document.createElement('div')
    videoContainer.id = `video-container-${participant.identity}`
    videoContainer.style.cssText = 'width:100%;height:100%;display:none;position:absolute;top:0;left:0;'
    videoArea.appendChild(videoContainer)

    const avatarContainer = document.createElement('div')
    avatarContainer.id = `avatar-${participant.identity}`
    avatarContainer.className = videoGridStyles.avatarContainer

    const avatar = document.createElement('div')
    avatar.className = videoGridStyles.avatar
    avatar.style.backgroundColor = this.getAvatarColor(participant.identity)
    avatar.textContent = this.getInitials(participant.identity)
    avatarContainer.appendChild(avatar)
    videoArea.appendChild(avatarContainer)

    const nameBar = document.createElement('div')
    nameBar.className = videoGridStyles.nameBar

    const name = document.createElement('span')
    name.className = videoGridStyles.name
    name.textContent = participant.identity === this.participantId ? `${this.participantId} (自分)` : participant.identity
    nameBar.appendChild(name)

    tile.appendChild(videoArea)
    tile.appendChild(nameBar)
    grid.appendChild(tile)

    this.updateGridLayout()
    this.updateParticipantList()
  }

  private removeParticipantTile(participantId: string): void {
    const tile = document.getElementById(`tile-${participantId}`)
    tile?.remove()
    this.updateGridLayout()
    this.updateParticipantList()
  }

  private updateParticipantList(): void {
    const list = document.getElementById('participant-list')
    const countEl = document.getElementById('participants-count')
    if (list === null || this.room === undefined) return

    while (list.firstChild !== null) {
      list.removeChild(list.firstChild)
    }

    const participants: Participant[] = [this.room.localParticipant]
    this.room.participants.forEach((p: Participant) => {
      if (p !== this.room?.localParticipant) {
        participants.push(p)
      }
    })

    participants.forEach((p) => {
      const item = document.createElement('div')
      item.className = sidebarStyles.participantItem

      const avatar = document.createElement('div')
      avatar.className = sidebarStyles.participantAvatar
      avatar.textContent = p.identity.slice(0, 1).toUpperCase()
      item.appendChild(avatar)

      const name = document.createElement('span')
      name.className = sidebarStyles.participantName
      name.textContent = p.identity === this.participantId ? `${this.participantId} (自分)` : p.identity
      item.appendChild(name)

      if (!p.isMicrophoneEnabled) {
        const mutedIcon = this.createMutedIcon()
        mutedIcon.classList.add(sidebarStyles.mutedIcon)
        item.appendChild(mutedIcon)
      }

      list.appendChild(item)
    })

    if (countEl !== null) {
      countEl.textContent = `参加者 (${participants.length})`
    }
  }

  private createMutedIcon(): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', '16')
    svg.setAttribute('height', '16')
    svg.setAttribute('viewBox', '0 0 24 24')
    svg.setAttribute('fill', 'currentColor')

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute(
      'd',
      'M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z'
    )
    svg.appendChild(path)

    return svg
  }

  private attachTrack(track: RemoteTrack | Track, participantId: string): void {
    if (track.kind === Track.Kind.Video) {
      const container = document.getElementById(`video-container-${participantId}`)
      const avatar = document.getElementById(`avatar-${participantId}`)
      if (container !== null) {
        const element = track.attach()
        element.style.cssText = 'width:100%;height:100%;object-fit:cover;'
        container.appendChild(element)
        container.style.display = 'block'
        if (avatar !== null) avatar.style.display = 'none'
      }
    } else if (track.kind === Track.Kind.Audio) {
      const element = track.attach()
      document.body.appendChild(element)
    }
  }

  private attachScreenShareTrack(track: RemoteTrack | Track, participantId: string): void {
    const grid = document.getElementById('video-grid')
    if (grid === null) {
      console.error('[MeetingWebRtc] video-grid element not found!')
      return
    }

    const tileId = `tile-screenshare-${participantId}`
    const existingTile = document.getElementById(tileId)
    if (existingTile !== null) {
      return
    }

    const tile = document.createElement('div')
    tile.id = tileId
    tile.className = videoGridStyles.screenShareTile

    const badge = document.createElement('div')
    badge.className = videoGridStyles.screenShareBadge
    badge.textContent = '画面共有'
    tile.appendChild(badge)

    const videoArea = document.createElement('div')
    videoArea.className = videoGridStyles.videoArea
    videoArea.style.cssText = 'position:relative;'

    const videoContainer = document.createElement('div')
    videoContainer.style.cssText = 'width:100%;height:100%;position:absolute;top:0;left:0;'
    const element = track.attach()
    element.style.cssText = 'width:100%;height:100%;object-fit:contain;'
    videoContainer.appendChild(element)
    videoArea.appendChild(videoContainer)

    const nameBar = document.createElement('div')
    nameBar.className = videoGridStyles.nameBar

    const name = document.createElement('span')
    name.className = videoGridStyles.name
    const displayName = participantId === this.participantId ? 'You' : participantId
    name.textContent = `${displayName}の画面`
    nameBar.appendChild(name)

    tile.appendChild(videoArea)
    tile.appendChild(nameBar)
    grid.appendChild(tile)

    this.updateGridLayout()
    console.log(`[MeetingWebRtc] Screen share tile attached from ${participantId}`)
  }

  private detachScreenShareTrack(participantId?: string): void {
    const grid = document.getElementById('video-grid')
    if (grid === null) return

    if (participantId !== undefined) {
      const tile = document.getElementById(`tile-screenshare-${participantId}`)
      tile?.remove()
    } else {
      const tiles = grid.querySelectorAll('[id^="tile-screenshare-"]')
      tiles.forEach((tile) => tile.remove())
    }

    this.updateGridLayout()
    console.log('[MeetingWebRtc] Screen share tile detached')
  }

  private detachTrack(track: RemoteTrack | Track, participantId: string): void {
    track.detach().forEach((el) => el.remove())
    if (track.kind === Track.Kind.Video) {
      const container = document.getElementById(`video-container-${participantId}`)
      const avatar = document.getElementById(`avatar-${participantId}`)
      if (container !== null) {
        container.innerHTML = ''
        container.style.display = 'none'
      }
      if (avatar !== null) avatar.style.display = 'flex'
    }
  }

  private updateGridLayout(): void {
    const grid = document.getElementById('video-grid')
    if (grid === null) return

    const count = grid.children.length
    grid.className = videoGridStyles.videoGrid

    if (count <= 1) grid.classList.add(videoGridStyles.grid1)
    else if (count <= 2) grid.classList.add(videoGridStyles.grid2)
    else if (count <= 4) grid.classList.add(videoGridStyles.grid4)
    else if (count <= 6) grid.classList.add(videoGridStyles.grid6)
    else grid.classList.add(videoGridStyles.grid9)
  }

  private getAvatarColor(id: string): string {
    const colors = ['#4285f4', '#ea4335', '#fbbc04', '#34a853', '#673ab7', '#e91e63', '#00bcd4']
    let hash = 0
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
  }

  private getInitials(name: string): string {
    return name.slice(0, 2).toUpperCase()
  }

  private async getAccessToken(playerId: string): Promise<string> {
    const params = { roomName: 'meeting-room', userName: playerId }
    const query = new URLSearchParams(params).toString()
    const res = await fetch(`${getChuraverseConfig().backendLivekitUrl}/?${query}`)
    const data = (await res.json()) as AccessTokenResponse
    return data.token
  }

  private setupUiEventHandlers(): void {
    const micButton = DomManager.getElementById('mic-toggle-button')
    const cameraButton = DomManager.getElementById('camera-toggle-button')
    const screenShareButton = DomManager.getElementById('screen-share-button')
    const exitButton = DomManager.getElementById('meeting-exit-button')

    micButton?.addEventListener('click', () => void this.toggleMicrophone())
    cameraButton?.addEventListener('click', () => void this.toggleCamera())
    screenShareButton?.addEventListener('click', () => void this.toggleScreenShare())
    exitButton?.addEventListener('click', () => this.exitMeeting())

    const chatInput = document.getElementById('chat-input') as HTMLInputElement | null
    const chatSendButton = document.getElementById('chat-send-button')

    chatSendButton?.addEventListener('click', () => {
      if (chatInput !== null && chatInput.value.trim() !== '') {
        void this.sendChatMessage(chatInput.value.trim())
        chatInput.value = ''
      }
    })

    chatInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && chatInput.value.trim() !== '') {
        e.preventDefault()
        void this.sendChatMessage(chatInput.value.trim())
        chatInput.value = ''
      }
    })
  }

  private exitMeeting(): void {
    this.cleanup()
    window.location.href = '/'
  }

  private async toggleMicrophone(): Promise<void> {
    if (this.room === undefined || !this.isConnected) return

    this.isMicEnabled = !this.isMicEnabled
    await this.room.localParticipant.setMicrophoneEnabled(this.isMicEnabled)
    this.updateButtonState('mic-toggle-button', this.isMicEnabled)
  }

  private async toggleCamera(): Promise<void> {
    if (this.room === undefined || !this.isConnected) return

    this.isCameraEnabled = !this.isCameraEnabled
    await this.room.localParticipant.setCameraEnabled(this.isCameraEnabled)
    this.updateButtonState('camera-toggle-button', this.isCameraEnabled)
  }

  private async toggleScreenShare(): Promise<void> {
    if (this.room === undefined || !this.isConnected) return

    this.isScreenShareEnabled = !this.isScreenShareEnabled
    try {
      await this.room.localParticipant.setScreenShareEnabled(this.isScreenShareEnabled)
      this.updateButtonState('screen-share-button', this.isScreenShareEnabled)
    } catch (e) {
      console.error('[MeetingWebRtc] Screen share failed:', e)
      this.isScreenShareEnabled = false
      this.updateButtonState('screen-share-button', false)
    }
  }

  private updateButtonState(buttonId: string, isActive: boolean): void {
    const button = DomManager.getElementById(buttonId)
    if (button === undefined) return

    if (isActive) {
      button.classList.add(controlBarStyles.activeButton)
    } else {
      button.classList.remove(controlBarStyles.activeButton)
    }
  }

  private async sendChatMessage(text: string): Promise<void> {
    if (this.room === undefined || !this.isConnected) return

    const message: ChatMessage = {
      type: 'chat',
      sender: this.participantId,
      text,
      timestamp: Date.now(),
    }

    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(JSON.stringify(message))
      await this.room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE)
      this.chatHistory.push(message)
      this.addChatMessage(this.participantId, text)
    } catch (e) {
      console.error('[MeetingWebRtc] Failed to send chat message:', e)
    }
  }

  private sendChatHistory(): void {
    if (this.room === undefined || !this.isConnected || this.chatHistory.length === 0) return

    const historyMessage: ChatMessage = {
      type: 'chat_history',
      sender: this.participantId,
      text: '',
      timestamp: Date.now(),
      history: this.chatHistory,
    }

    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(JSON.stringify(historyMessage))
      void this.room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE)
      console.log(`[MeetingWebRtc] Sent chat history (${this.chatHistory.length} messages)`)
    } catch (e) {
      console.error('[MeetingWebRtc] Failed to send chat history:', e)
    }
  }

  private addChatMessage(senderId: string, text: string): void {
    const chatMessages = document.getElementById('chat-messages')
    if (chatMessages === null) return

    const messageEl = document.createElement('div')
    messageEl.className = sidebarStyles.chatMessage

    const authorEl = document.createElement('span')
    authorEl.className = sidebarStyles.chatAuthor
    authorEl.textContent = senderId === this.participantId ? `${this.participantId} (自分)` : senderId
    messageEl.appendChild(authorEl)

    const textEl = document.createElement('span')
    textEl.className = sidebarStyles.chatText
    textEl.textContent = text
    messageEl.appendChild(textEl)

    chatMessages.appendChild(messageEl)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }
}
