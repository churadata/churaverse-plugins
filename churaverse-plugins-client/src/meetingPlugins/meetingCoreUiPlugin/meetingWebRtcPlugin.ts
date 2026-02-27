import { BasePlugin, DomManager, getChuraverseConfig, IMeetingScene } from 'churaverse-engine-client'
import { Room, RoomEvent, RoomOptions, VideoPresets, Track, RemoteTrack, RemoteParticipant, Participant, DataPacket_Kind } from 'livekit-client'
import heroBasic from '@churaverse/player-plugin-client/assets/hero.png'
import heroRed from '@churaverse/player-plugin-client/assets/hero_red.png'
import heroBlue from '@churaverse/player-plugin-client/assets/hero_blue.png'
import heroBlack from '@churaverse/player-plugin-client/assets/hero_black.png'
import heroGray from '@churaverse/player-plugin-client/assets/hero_gray.png'
import sharkSprite from './assets/shark.png'
import bombSprite from './assets/bomb_large_explosion.png'
import { VIDEO_GRID_ID, videoGridStyles } from './components/VideoGridComponent'
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
import {
  PARTICIPANT_LIST_ID,
  PARTICIPANTS_COUNT_ID,
  CHAT_MESSAGES_ID,
  CHAT_INPUT_ID,
  CHAT_SEND_BUTTON_ID,
  sidebarStyles,
} from './components/MeetingSidebarComponent'

const HERO_SPRITES = [heroBasic, heroRed, heroBlue, heroBlack, heroGray]

interface AccessTokenResponse {
  token: string
}

interface DataMessage {
  type: 'chat' | 'chat_history' | 'name_announce' | 'avatar_announce' | 'reaction'
  sender: string
  text: string
  timestamp: number
  history?: DataMessage[]
  displayName?: string
  avatarIndex?: number
  reactionType?: 'shark' | 'bomb'
}

export class MeetingWebRtcPlugin extends BasePlugin<IMeetingScene> {
  private room?: Room
  private participantId: string = ''
  private displayName: string = ''
  private isMicEnabled: boolean = false
  private isCameraEnabled: boolean = false
  private isScreenShareEnabled: boolean = false
  private isConnected: boolean = false
  private chatHistory: DataMessage[] = []
  private participantNames: Map<string, string> = new Map()
  private selectedAvatarIndex: number = 0
  private participantAvatars: Map<string, number> = new Map()
  private sidebarScrollIndex: number = 0
  private readonly maxVisibleSidebarTiles: number = 5

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))
  }

  private init(): void {
    this.displayName = sessionStorage.getItem('meetingPlayerName') ?? this.readCookie('name') ?? ''
    this.participantId = this.displayName !== '' ? this.displayName : this.generateParticipantId()
    this.participantNames.set(this.participantId, this.displayName !== '' ? this.displayName : this.participantId)

    const storedAvatar = sessionStorage.getItem('meetingAvatarIndex')
    if (storedAvatar !== null) {
      this.selectedAvatarIndex = parseInt(storedAvatar, 10)
    }

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
      await this.room.localParticipant.setName(this.displayName !== '' ? this.displayName : this.participantId)
      this.isConnected = true
      console.log(`[MeetingWebRtc] Connected to room: ${this.room.name}`)

      this.broadcastName()
      this.participantAvatars.set(this.participantId, this.selectedAvatarIndex)
      this.broadcastAvatar()
      this.addParticipantTile(this.room.localParticipant)

      this.room.participants.forEach((participant: RemoteParticipant) => {
        console.log(`[MeetingWebRtc] Adding existing participant: ${participant.identity}`)
        this.addParticipantTile(participant)

        participant.videoTracks.forEach((publication) => {
          if (publication.track !== undefined && publication.isSubscribed) {
            if (publication.source === Track.Source.ScreenShare) {
              this.attachScreenShareTrack(publication.track, participant.identity)
            } else {
              this.attachTrack(publication.track, participant.identity)
            }
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
      this.broadcastName()
      this.broadcastAvatar()
      this.sendChatHistory()
    })

    this.room.on(RoomEvent.ParticipantDisconnected, (participant) => {
      console.log(`[MeetingWebRtc] Participant disconnected: ${participant.identity}`)
      this.removeParticipantTile(participant.identity)
    })

    this.room.on(RoomEvent.ParticipantNameChanged, (name, participant) => {
      console.log(`[MeetingWebRtc] Participant name changed: ${participant.identity} -> ${name}`)
      this.updateParticipantTileName(participant)
    })

    this.room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
      console.log(`[MeetingWebRtc] Track subscribed: ${track.kind} (source: ${publication.source}) from ${participant.identity}`)
      if (publication.source === Track.Source.ScreenShare) {
        this.attachScreenShareTrack(track, participant.identity)
      } else {
        this.attachTrack(track, participant.identity)
      }
      this.updateMicIcon(participant)
    })

    this.room.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
      console.log(`[MeetingWebRtc] Track unsubscribed: ${track.kind} (source: ${publication.source}) from ${participant.identity}`)
      if (publication.source === Track.Source.ScreenShare) {
        track.detach().forEach((el) => { el.remove() })
        this.detachScreenShareTrack(participant.identity)
      } else {
        this.detachTrack(track, participant.identity)
      }
      this.updateMicIcon(participant)
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
      this.updateMicIcon(participant)
    })

    this.room.on(RoomEvent.LocalTrackUnpublished, (publication, participant) => {
      console.log(`[MeetingWebRtc] Local track unpublished: ${publication.kind} (source: ${publication.source})`)
      if (publication.track !== undefined) {
        if (publication.source === Track.Source.ScreenShare) {
          publication.track.detach().forEach((el) => { el.remove() })
          this.detachScreenShareTrack(participant.identity)
        } else {
          this.detachTrack(publication.track, participant.identity)
        }
      }
      this.updateMicIcon(participant)
    })

    this.room.on(RoomEvent.TrackMuted, (_publication, participant) => {
      this.updateMicIcon(participant)
    })

    this.room.on(RoomEvent.TrackUnmuted, (_publication, participant) => {
      this.updateMicIcon(participant)
    })

    this.room.on(RoomEvent.DataReceived, (payload, participant) => {
      try {
        const decoder = new TextDecoder()
        const jsonStr = decoder.decode(payload)
        const message = JSON.parse(jsonStr) as DataMessage

        if (message.type === 'name_announce' && participant !== undefined && message.displayName !== undefined) {
          this.participantNames.set(participant.identity, message.displayName)
          this.updateParticipantTileName(participant)
        } else if (message.type === 'chat_history' && message.history !== undefined) {
          message.history.forEach((historyMsg: DataMessage) => {
            const exists = this.chatHistory.some((m) => m.timestamp === historyMsg.timestamp && m.sender === historyMsg.sender)
            if (!exists) {
              this.chatHistory.push(historyMsg)
              this.addDataMessage(historyMsg.sender, historyMsg.text)
            }
          })
        } else if (message.type === 'chat' && message.text !== undefined && participant !== undefined) {
          this.chatHistory.push(message)
          this.addDataMessage(participant.identity, message.text)
        } else if (message.type === 'avatar_announce' && participant !== undefined && message.avatarIndex !== undefined) {
          this.participantAvatars.set(participant.identity, message.avatarIndex)
          this.updateParticipantTileName(participant)
        } else if (message.type === 'reaction' && message.reactionType !== undefined) {
          this.showReactionAnimation(message.reactionType)
        }
      } catch (e) {
        console.error('[MeetingWebRtc] Failed to parse chat message:', e)
      }
    })
  }

  private addParticipantTile(participant: Participant): void {
    const grid = document.getElementById(VIDEO_GRID_ID)
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
    const displayName = this.getDisplayName(participant)
    avatar.style.backgroundImage = `url(${this.getHeroSprite(displayName, participant.identity)})`
    avatarContainer.appendChild(avatar)
    videoArea.appendChild(avatarContainer)

    const nameBar = document.createElement('div')
    nameBar.className = videoGridStyles.nameBar

    const name = document.createElement('span')
    name.className = videoGridStyles.name
    name.textContent = participant.identity === this.participantId ? `${displayName} (自分)` : displayName
    nameBar.appendChild(name)

    if (!participant.isMicrophoneEnabled) {
      const mutedIcon = this.createMutedIcon()
      mutedIcon.classList.add(videoGridStyles.micOffIcon)
      mutedIcon.id = `mic-icon-${participant.identity}`
      nameBar.appendChild(mutedIcon)
    }

    tile.appendChild(videoArea)
    tile.appendChild(nameBar)
    grid.appendChild(tile)

    this.updateGridLayout()
    this.updateParticipantList()
  }

  private updateParticipantTileName(participant: Participant): void {
    const displayName = this.getDisplayName(participant)
    const tile = document.getElementById(`tile-${participant.identity}`)
    if (tile !== null) {
      const nameSpan = tile.querySelector(`.${videoGridStyles.name}`)
      if (nameSpan !== null) {
        nameSpan.textContent = participant.identity === this.participantId ? `${displayName} (自分)` : displayName
      }
      const avatar = tile.querySelector(`.${videoGridStyles.avatar}`)
      if (avatar !== null) {
        (avatar as HTMLElement).style.backgroundImage = `url(${this.getHeroSprite(displayName, participant.identity)})`
      }
    }
    this.updateParticipantList()
  }

  private removeParticipantTile(participantId: string): void {
    const tile = document.getElementById(`tile-${participantId}`)
    tile?.remove()
    const screenShareTile = document.getElementById(`tile-screenshare-${participantId}`)
    screenShareTile?.remove()
    this.updateGridLayout()
    this.updateParticipantList()
  }

  private updateParticipantList(): void {
    const list = document.getElementById(PARTICIPANT_LIST_ID)
    const countEl = document.getElementById(PARTICIPANTS_COUNT_ID)
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

      const pDisplayName = this.getDisplayName(p)
      const avatar = document.createElement('div')
      avatar.className = sidebarStyles.participantAvatar
      avatar.textContent = pDisplayName.slice(0, 1).toUpperCase()
      item.appendChild(avatar)

      const name = document.createElement('span')
      name.className = sidebarStyles.participantName
      name.textContent = p.identity === this.participantId ? `${pDisplayName} (自分)` : pDisplayName
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

  private updateMicIcon(participant: Participant): void {
    const iconId = `mic-icon-${participant.identity}`
    const existing = document.getElementById(iconId)
    const tile = document.getElementById(`tile-${participant.identity}`)
    if (tile === null) return

    if (participant.isMicrophoneEnabled) {
      existing?.remove()
    } else if (existing === null) {
      const nameBar = tile.querySelector(`.${videoGridStyles.nameBar}`)
      if (nameBar !== null) {
        const mutedIcon = this.createMutedIcon()
        mutedIcon.classList.add(videoGridStyles.micOffIcon)
        mutedIcon.id = iconId
        nameBar.appendChild(mutedIcon)
      }
    }
    this.updateParticipantList()
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
    const grid = document.getElementById(VIDEO_GRID_ID)
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
    const participant = this.room?.localParticipant.identity === participantId
      ? this.room.localParticipant
      : this.room?.participants.get(participantId)
    const screenShareName = participant !== undefined
      ? this.getDisplayName(participant)
      : participantId
    const displayName = participantId === this.participantId ? `${screenShareName} (自分)` : screenShareName
    name.textContent = `${displayName}の画面`
    nameBar.appendChild(name)

    tile.appendChild(videoArea)
    tile.appendChild(nameBar)
    grid.insertBefore(tile, grid.firstChild)

    this.updateGridLayout()
    console.log(`[MeetingWebRtc] Screen share tile attached from ${participantId}`)
  }

  private detachScreenShareTrack(participantId?: string): void {
    const grid = document.getElementById(VIDEO_GRID_ID)
    if (grid === null) return

    const removeTile = (tile: Element): void => {
      tile.querySelectorAll('video, audio').forEach((el) => { el.remove() })
      tile.remove()
    }

    if (participantId !== undefined) {
      const tile = document.getElementById(`tile-screenshare-${participantId}`)
      if (tile !== null) { removeTile(tile) }
    } else {
      const tiles = grid.querySelectorAll('[id^="tile-screenshare-"]')
      tiles.forEach((tile) => { removeTile(tile) })
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
    const grid = document.getElementById(VIDEO_GRID_ID)
    if (grid === null) return

    const hasScreenShare = document.querySelector('[id^="tile-screenshare-"]') !== null

    if (hasScreenShare) {
      this.applyScreenShareLayout(grid)
    } else {
      this.removeScreenShareSidebar(grid)
      grid.className = videoGridStyles.videoGrid
      grid.style.gridTemplateColumns = ''
      const count = grid.children.length
      if (count <= 1) grid.classList.add(videoGridStyles.grid1)
      else if (count <= 2) grid.classList.add(videoGridStyles.grid2)
      else if (count <= 4) grid.classList.add(videoGridStyles.grid4)
      else if (count <= 6) grid.classList.add(videoGridStyles.grid6)
      else grid.classList.add(videoGridStyles.grid9)
    }
  }

  private applyScreenShareLayout(grid: HTMLElement): void {
    grid.className = videoGridStyles.videoGrid
    grid.classList.add(videoGridStyles.screenShareLayout)
    grid.style.gridTemplateColumns = ''

    let sidebar = document.getElementById('participant-sidebar')
    if (sidebar === null) {
      sidebar = document.createElement('div')
      sidebar.id = 'participant-sidebar'
      sidebar.className = videoGridStyles.participantSidebar

      const arrowUp = document.createElement('button')
      arrowUp.className = `defaultStyle ${videoGridStyles.sidebarArrow}`
      arrowUp.innerHTML = '&#9650;'
      arrowUp.id = 'sidebar-arrow-up'
      arrowUp.addEventListener('click', () => { this.scrollSidebar(-1) })

      const tilesContainer = document.createElement('div')
      tilesContainer.id = 'sidebar-tiles-container'
      tilesContainer.className = videoGridStyles.sidebarTilesContainer

      const arrowDown = document.createElement('button')
      arrowDown.className = `defaultStyle ${videoGridStyles.sidebarArrow}`
      arrowDown.innerHTML = '&#9660;'
      arrowDown.id = 'sidebar-arrow-down'
      arrowDown.addEventListener('click', () => { this.scrollSidebar(1) })

      sidebar.appendChild(arrowUp)
      sidebar.appendChild(tilesContainer)
      sidebar.appendChild(arrowDown)
      grid.appendChild(sidebar)
      this.sidebarScrollIndex = 0
    }

    const tilesContainer = document.getElementById('sidebar-tiles-container')
    if (tilesContainer !== null) {
      const participantTiles = Array.from(grid.querySelectorAll(':scope > [id^="tile-"]:not([id^="tile-screenshare-"])'))
      participantTiles.forEach((tile) => {
        tilesContainer.appendChild(tile)
      })
    }

    this.updateSidebarVisibility()
  }

  private removeScreenShareSidebar(grid: HTMLElement): void {
    const sidebar = document.getElementById('participant-sidebar')
    if (sidebar === null) return

    const tilesContainer = document.getElementById('sidebar-tiles-container')
    if (tilesContainer !== null) {
      const tiles = Array.from(tilesContainer.children)
      tiles.forEach((tile) => {
        const el = tile as HTMLElement
        el.style.display = ''
        grid.appendChild(el)
      })
    }

    sidebar.remove()
    this.sidebarScrollIndex = 0
  }

  private scrollSidebar(direction: number): void {
    const tilesContainer = document.getElementById('sidebar-tiles-container')
    if (tilesContainer === null) return

    const totalTiles = tilesContainer.children.length
    const maxIndex = Math.max(0, totalTiles - this.maxVisibleSidebarTiles)
    this.sidebarScrollIndex = Math.max(0, Math.min(this.sidebarScrollIndex + direction, maxIndex))

    this.updateSidebarVisibility()
  }

  private updateSidebarVisibility(): void {
    const tilesContainer = document.getElementById('sidebar-tiles-container')
    const upArrow = document.getElementById('sidebar-arrow-up') as HTMLButtonElement | null
    const downArrow = document.getElementById('sidebar-arrow-down') as HTMLButtonElement | null
    if (tilesContainer === null || upArrow === null || downArrow === null) return

    const totalTiles = tilesContainer.children.length

    Array.from(tilesContainer.children).forEach((tile, index) => {
      const el = tile as HTMLElement
      if (index >= this.sidebarScrollIndex && index < this.sidebarScrollIndex + this.maxVisibleSidebarTiles) {
        el.style.display = ''
      } else {
        el.style.display = 'none'
      }
    })

    const showArrows = totalTiles > this.maxVisibleSidebarTiles
    upArrow.style.display = showArrows ? '' : 'none'
    downArrow.style.display = showArrows ? '' : 'none'
    upArrow.disabled = this.sidebarScrollIndex <= 0
    downArrow.disabled = this.sidebarScrollIndex >= totalTiles - this.maxVisibleSidebarTiles
  }

  private getDisplayName(participant: Participant): string {
    const stored = this.participantNames.get(participant.identity)
    if (stored !== undefined) return stored
    if (participant.name !== undefined && participant.name !== '') return participant.name
    return participant.identity
  }

  private broadcastName(): void {
    if (this.room === undefined || !this.isConnected) return
    const message: DataMessage = {
      type: 'name_announce',
      sender: this.participantId,
      text: '',
      timestamp: Date.now(),
      displayName: this.displayName !== '' ? this.displayName : this.participantId,
    }
    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(JSON.stringify(message))
      void this.room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE)
    } catch (e) {
      console.error('[MeetingWebRtc] Failed to broadcast name:', e)
    }
  }

  private getHeroSprite(name: string, participantIdentity?: string): string {
    if (participantIdentity !== undefined) {
      const avatarIdx = this.participantAvatars.get(participantIdentity)
      if (avatarIdx !== undefined) {
        return HERO_SPRITES[avatarIdx]
      }
    }
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return HERO_SPRITES[Math.abs(hash) % HERO_SPRITES.length]
  }

  private broadcastAvatar(): void {
    if (this.room === undefined || !this.isConnected) return
    const message: DataMessage = {
      type: 'avatar_announce',
      sender: this.participantId,
      text: '',
      timestamp: Date.now(),
      avatarIndex: this.selectedAvatarIndex,
    }
    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(JSON.stringify(message))
      void this.room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE)
    } catch (e) {
      console.error('[MeetingWebRtc] Failed to broadcast avatar:', e)
    }
  }

  private sendReaction(reactionType: 'shark' | 'bomb'): void {
    if (this.room === undefined || !this.isConnected) return
    const message: DataMessage = {
      type: 'reaction',
      sender: this.participantId,
      text: '',
      timestamp: Date.now(),
      reactionType,
    }
    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(JSON.stringify(message))
      void this.room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE)
      this.showReactionAnimation(reactionType)
    } catch (e) {
      console.error('[MeetingWebRtc] Failed to send reaction:', e)
    }
  }

  private showReactionAnimation(reactionType: 'shark' | 'bomb'): void {
    const container = document.querySelector('[class*="mainArea"]') as HTMLElement
    if (container === null) return
    if (reactionType === 'shark') {
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
      if (x > container.clientWidth + size) { shark.remove(); return }
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

    let frameIndex = 0
    let dropCount = 0
    let lastFrameTime = 0
    const animate = (timestamp: number): void => {
      if (lastFrameTime === 0) lastFrameTime = timestamp
      if (timestamp - lastFrameTime > 125) {
        if (dropCount < 9) {
          const col = frameIndex % 3
          const row = Math.floor(frameIndex / 3)
          bomb.style.backgroundPosition = `${-col * size}px ${-row * size}px`
          frameIndex = (frameIndex + 1) % 3
          dropCount++
        } else {
          if (frameIndex < 3) frameIndex = 3
          else frameIndex++
          if (frameIndex >= 12) { bomb.remove(); return }
          const col = frameIndex % 3
          const row = Math.floor(frameIndex / 3)
          bomb.style.backgroundPosition = `${-col * size}px ${-row * size}px`
          const progress = (frameIndex - 3) / 8
          bomb.style.transform = `scale(${1 + progress * 5})`
          bomb.style.opacity = `${1 - progress * 0.6}`
        }
        lastFrameTime = timestamp
      }
      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }

  private async getAccessToken(playerId: string): Promise<string> {
    const displayName = this.displayName !== '' ? this.displayName : playerId
    const params = { roomName: 'meeting-room', userName: playerId, displayName }
    const query = new URLSearchParams(params).toString()
    const res = await fetch(`${getChuraverseConfig().backendLivekitUrl}/?${query}`)
    const data = (await res.json()) as AccessTokenResponse
    return data.token
  }

  private setupUiEventHandlers(): void {
    const micButton = DomManager.getElementById(MIC_TOGGLE_BUTTON_ID)
    const cameraButton = DomManager.getElementById(CAMERA_TOGGLE_BUTTON_ID)
    const screenShareButton = DomManager.getElementById(SCREEN_SHARE_BUTTON_ID)
    const exitButton = DomManager.getElementById(MEETING_EXIT_BUTTON_ID)

    micButton.addEventListener('click', () => { void this.toggleMicrophone() })
    cameraButton.addEventListener('click', () => { void this.toggleCamera() })
    screenShareButton.addEventListener('click', () => { void this.toggleScreenShare() })
    exitButton.addEventListener('click', () => { this.exitMeeting() })

    const chatInput = DomManager.getElementById<HTMLInputElement>(CHAT_INPUT_ID)
    const chatSendButton = DomManager.getElementById(CHAT_SEND_BUTTON_ID)

    chatSendButton.addEventListener('click', () => {
      if (chatInput.value.trim() !== '') {
        void this.sendDataMessage(chatInput.value.trim())
        chatInput.value = ''
      }
    })

    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && chatInput.value.trim() !== '') {
        e.preventDefault()
        void this.sendDataMessage(chatInput.value.trim())
        chatInput.value = ''
      }
    })

    const portalButton = document.getElementById(PORTAL_BUTTON_ID)
    if (portalButton !== null) {
      portalButton.addEventListener('click', () => { this.enterGameMode() })
    }

    const sharkButton = document.getElementById(REACTION_SHARK_BUTTON_ID)
    if (sharkButton !== null) {
      sharkButton.addEventListener('click', () => { this.sendReaction('shark') })
    }

    const bombButton = document.getElementById(REACTION_BOMB_BUTTON_ID)
    if (bombButton !== null) {
      bombButton.addEventListener('click', () => { this.sendReaction('bomb') })
    }
  }

  private enterGameMode(): void {
    sessionStorage.setItem('portalToGameMode', 'true')
    sessionStorage.setItem('meetingPlayerName', this.displayName)
    sessionStorage.setItem('meetingAvatarIndex', String(this.selectedAvatarIndex))
    this.cleanup()
    window.location.href = '/'
  }

  private exitMeeting(): void {
    this.cleanup()
    window.location.href = '/'
  }

  private async toggleMicrophone(): Promise<void> {
    if (this.room === undefined || !this.isConnected) return

    this.isMicEnabled = !this.isMicEnabled
    await this.room.localParticipant.setMicrophoneEnabled(this.isMicEnabled)
    this.updateButtonState(MIC_TOGGLE_BUTTON_ID, !this.isMicEnabled)
  }

  private async toggleCamera(): Promise<void> {
    if (this.room === undefined || !this.isConnected) return

    this.isCameraEnabled = !this.isCameraEnabled
    await this.room.localParticipant.setCameraEnabled(this.isCameraEnabled)
    this.updateButtonState(CAMERA_TOGGLE_BUTTON_ID, !this.isCameraEnabled)
  }

  private async toggleScreenShare(): Promise<void> {
    if (this.room === undefined || !this.isConnected) return

    this.isScreenShareEnabled = !this.isScreenShareEnabled
    try {
      await this.room.localParticipant.setScreenShareEnabled(this.isScreenShareEnabled)
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

  private async sendDataMessage(text: string): Promise<void> {
    if (this.room === undefined || !this.isConnected) return

    const message: DataMessage = {
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
      this.addDataMessage(this.participantId, text)
    } catch (e) {
      console.error('[MeetingWebRtc] Failed to send chat message:', e)
    }
  }

  private sendChatHistory(): void {
    if (this.room === undefined || !this.isConnected || this.chatHistory.length === 0) return

    const historyMessage: DataMessage = {
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

  private addDataMessage(senderId: string, text: string): void {
    const chatMessages = document.getElementById(CHAT_MESSAGES_ID)
    if (chatMessages === null) return

    const messageEl = document.createElement('div')
    messageEl.className = sidebarStyles.chatMessage

    const displayName = this.participantNames.get(senderId) ?? senderId
    const authorEl = document.createElement('span')
    authorEl.className = sidebarStyles.chatAuthor
    authorEl.textContent = senderId === this.participantId ? `${displayName} (自分)` : displayName
    messageEl.appendChild(authorEl)

    const textEl = document.createElement('span')
    textEl.className = sidebarStyles.chatText
    textEl.textContent = text
    messageEl.appendChild(textEl)

    chatMessages.appendChild(messageEl)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }
}
