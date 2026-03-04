import { DomManager } from 'churaverse-engine-client'
import { RemoteTrack, Track, Participant } from 'livekit-client'
import { VIDEO_GRID_ID, videoGridStyles } from '../components/VideoGridComponent'
import {
  ParticipantTileComponent,
  PARTICIPANT_TILE_ID_PREFIX,
  VIDEO_CONTAINER_ID_PREFIX,
  AVATAR_CONTAINER_ID_PREFIX,
} from '../components/ParticipantTileComponent'
import { getAvatarColor, getInitials } from '../utils/avatarUtils'

const MAX_VISIBLE_SIDEBAR_TILES = 5

export class VideoGridUi {
  private sidebarScrollIndex: number = 0

  public constructor(private readonly ownParticipantId: string) {}

  public addParticipantTile(participant: Participant): void {
    const grid = document.getElementById(VIDEO_GRID_ID)
    if (grid === null) {
      console.error('[VideoGridUi] video-grid element not found!')
      return
    }

    const tileId = `${PARTICIPANT_TILE_ID_PREFIX}${participant.identity}`
    if (document.getElementById(tileId) !== null) return

    const tile = DomManager.jsxToDom(
      ParticipantTileComponent({
        participantId: participant.identity,
        displayName: participant.identity,
        avatarColor: getAvatarColor(participant.identity),
        initials: getInitials(participant.identity),
        isSelf: participant.identity === this.ownParticipantId,
      })
    )

    grid.appendChild(tile)
    this.updateGridLayout()
  }

  public removeParticipantTile(participantId: string): void {
    document.getElementById(`${PARTICIPANT_TILE_ID_PREFIX}${participantId}`)?.remove()
    document.getElementById(`tile-screenshare-${participantId}`)?.remove()
    this.updateGridLayout()
  }

  public attachTrack(track: RemoteTrack | Track, participantId: string): void {
    if (track.kind === Track.Kind.Video) {
      const container = document.getElementById(`${VIDEO_CONTAINER_ID_PREFIX}${participantId}`)
      const avatarContainer = document.getElementById(`${AVATAR_CONTAINER_ID_PREFIX}${participantId}`)
      if (container !== null) {
        const element = track.attach()
        element.style.cssText = 'width:100%;height:100%;object-fit:cover;'
        container.appendChild(element)
        container.style.display = 'block'
        if (avatarContainer !== null) avatarContainer.style.display = 'none'
      }
    } else if (track.kind === Track.Kind.Audio) {
      const element = track.attach()
      const tile = document.getElementById(`${PARTICIPANT_TILE_ID_PREFIX}${participantId}`)
      tile?.appendChild(element)
    }
  }

  public detachTrack(track: RemoteTrack | Track, participantId: string): void {
    track.detach().forEach((el) => { el.remove() })
    if (track.kind === Track.Kind.Video) {
      const container = document.getElementById(`${VIDEO_CONTAINER_ID_PREFIX}${participantId}`)
      const avatarContainer = document.getElementById(`${AVATAR_CONTAINER_ID_PREFIX}${participantId}`)
      if (container !== null) {
        while (container.firstChild !== null) {
          container.removeChild(container.firstChild)
        }
        container.style.display = 'none'
      }
      if (avatarContainer !== null) avatarContainer.style.display = 'flex'
    }
  }

  public attachScreenShareTrack(track: RemoteTrack | Track, participantId: string): void {
    const grid = document.getElementById(VIDEO_GRID_ID)
    if (grid === null) {
      console.error('[VideoGridUi] video-grid element not found!')
      return
    }

    const tileId = `tile-screenshare-${participantId}`
    if (document.getElementById(tileId) !== null) return

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
    const displayName = participantId === this.ownParticipantId
      ? `${participantId} (自分)`
      : participantId
    name.textContent = `${displayName}の画面`
    nameBar.appendChild(name)

    tile.appendChild(videoArea)
    tile.appendChild(nameBar)
    grid.insertBefore(tile, grid.firstChild)

    this.updateGridLayout()
  }

  public detachScreenShareTrack(participantId?: string): void {
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
      grid.querySelectorAll('[id^="tile-screenshare-"]').forEach((tile) => { removeTile(tile) })
    }

    this.updateGridLayout()
  }

  public updateGridLayout(): void {
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

  public scrollSidebar(direction: number): void {
    const tilesContainer = document.getElementById('sidebar-tiles-container')
    if (tilesContainer === null) return

    const totalTiles = tilesContainer.children.length
    const maxIndex = Math.max(0, totalTiles - MAX_VISIBLE_SIDEBAR_TILES)
    this.sidebarScrollIndex = Math.max(0, Math.min(this.sidebarScrollIndex + direction, maxIndex))
    this.updateSidebarVisibility()
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
      arrowUp.textContent = '\u25B2'
      arrowUp.id = 'sidebar-arrow-up'
      arrowUp.addEventListener('click', () => { this.scrollSidebar(-1) })

      const tilesContainer = document.createElement('div')
      tilesContainer.id = 'sidebar-tiles-container'
      tilesContainer.className = videoGridStyles.sidebarTilesContainer

      const arrowDown = document.createElement('button')
      arrowDown.className = `defaultStyle ${videoGridStyles.sidebarArrow}`
      arrowDown.textContent = '\u25BC'
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
      grid
        .querySelectorAll(':scope > [id^="tile-"]:not([id^="tile-screenshare-"])')
        .forEach((tile) => { tilesContainer.appendChild(tile) })
    }

    this.updateSidebarVisibility()
  }

  private removeScreenShareSidebar(grid: HTMLElement): void {
    const sidebar = document.getElementById('participant-sidebar')
    if (sidebar === null) return

    const tilesContainer = document.getElementById('sidebar-tiles-container')
    if (tilesContainer !== null) {
      Array.from(tilesContainer.children).forEach((tile) => {
        const el = tile as HTMLElement
        el.style.display = ''
        grid.appendChild(el)
      })
    }

    sidebar.remove()
    this.sidebarScrollIndex = 0
  }

  private updateSidebarVisibility(): void {
    const tilesContainer = document.getElementById('sidebar-tiles-container')
    const upArrow = document.getElementById('sidebar-arrow-up') as HTMLButtonElement | null
    const downArrow = document.getElementById('sidebar-arrow-down') as HTMLButtonElement | null
    if (tilesContainer === null || upArrow === null || downArrow === null) return

    const totalTiles = tilesContainer.children.length

    Array.from(tilesContainer.children).forEach((tile, index) => {
      const el = tile as HTMLElement
      el.style.display =
        index >= this.sidebarScrollIndex && index < this.sidebarScrollIndex + MAX_VISIBLE_SIDEBAR_TILES
          ? ''
          : 'none'
    })

    const showArrows = totalTiles > MAX_VISIBLE_SIDEBAR_TILES
    upArrow.style.display = showArrows ? '' : 'none'
    downArrow.style.display = showArrows ? '' : 'none'
    upArrow.disabled = this.sidebarScrollIndex <= 0
    downArrow.disabled = this.sidebarScrollIndex >= totalTiles - MAX_VISIBLE_SIDEBAR_TILES
  }
}
