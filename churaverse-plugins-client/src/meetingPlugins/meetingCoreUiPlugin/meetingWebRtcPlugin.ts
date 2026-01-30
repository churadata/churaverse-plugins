import { BasePlugin, DomManager, getChuraverseConfig, IMeetingScene } from 'churaverse-engine-client'
import { Room, RoomEvent, RoomOptions, VideoPresets, Track, RemoteTrack, Participant } from 'livekit-client'
import { videoGridStyles } from './components/VideoGridComponent'
import { controlBarStyles } from './components/MeetingControlBarComponent'
import { sidebarStyles } from './components/MeetingSidebarComponent'

interface AccessTokenResponse {
  token: string
}

export class MeetingWebRtcPlugin extends BasePlugin<IMeetingScene> {
  private room?: Room
  private participantId: string = ''
  private isMicEnabled: boolean = false
  private isCameraEnabled: boolean = false
  private isScreenShareEnabled: boolean = false
  private isConnected: boolean = false

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))
  }

  private init(): void {
    this.participantId = this.generateParticipantId()
    window.addEventListener('beforeunload', () => this.cleanup())
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
    })

    this.room.on(RoomEvent.ParticipantDisconnected, (participant) => {
      console.log(`[MeetingWebRtc] Participant disconnected: ${participant.identity}`)
      this.removeParticipantTile(participant.identity)
    })

    this.room.on(RoomEvent.TrackSubscribed, (track, _publication, participant) => {
      console.log(`[MeetingWebRtc] Track subscribed: ${track.kind} from ${participant.identity}`)
      this.attachTrack(track, participant.identity)
    })

    this.room.on(RoomEvent.TrackUnsubscribed, (track, _publication, participant) => {
      console.log(`[MeetingWebRtc] Track unsubscribed: ${track.kind} from ${participant.identity}`)
      this.detachTrack(track, participant.identity)
    })

    this.room.on(RoomEvent.LocalTrackPublished, (publication, participant) => {
      console.log(`[MeetingWebRtc] Local track published: ${publication.kind}`)
      if (publication.track !== undefined) {
        this.attachTrack(publication.track, participant.identity)
      }
    })

    this.room.on(RoomEvent.LocalTrackUnpublished, (publication, participant) => {
      console.log(`[MeetingWebRtc] Local track unpublished: ${publication.kind}`)
      if (publication.track !== undefined) {
        this.detachTrack(publication.track, participant.identity)
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
    name.textContent = participant.identity === this.participantId ? 'You' : participant.identity.slice(0, 8)
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

    // リストをクリア
    while (list.firstChild !== null) {
      list.removeChild(list.firstChild)
    }

    // 参加者を収集（ローカル + リモート）
    const participants: Participant[] = [this.room.localParticipant]
    this.room.participants.forEach((p: Participant) => {
      if (p !== this.room?.localParticipant) {
        participants.push(p)
      }
    })

    // 各参加者のアイテムを追加
    participants.forEach((p) => {
      const item = document.createElement('div')
      item.className = sidebarStyles.participantItem

      const avatar = document.createElement('div')
      avatar.className = sidebarStyles.participantAvatar
      avatar.textContent = p.identity.slice(0, 1).toUpperCase()
      item.appendChild(avatar)

      const name = document.createElement('span')
      name.className = sidebarStyles.participantName
      name.textContent = p.identity === this.participantId ? 'You' : p.identity.slice(0, 8)
      item.appendChild(name)

      // マイクがOFFの場合はミュートアイコンを表示
      if (!p.isMicrophoneEnabled) {
        const mutedIcon = this.createMutedIcon()
        mutedIcon.classList.add(sidebarStyles.mutedIcon)
        item.appendChild(mutedIcon)
      }

      list.appendChild(item)
    })

    // 参加者カウントを更新
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
}
