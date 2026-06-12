import { DomManager } from 'churaverse-engine-client'
import { RemoteTrack, Track, Participant } from 'livekit-client'
import { VIDEO_GRID_ID, videoGridStyles } from '../components/VideoGridComponent'
import {
  ParticipantTileComponent,
  PARTICIPANT_TILE_ID_PREFIX,
  VIDEO_CONTAINER_ID_PREFIX,
  AVATAR_CONTAINER_ID_PREFIX,
} from '../components/ParticipantTileComponent'
import { getHeroSprite } from '../utils/avatarUtils'
import { getParticipantDisplayName } from '@churaverse/livekit-client'

const MAX_VISIBLE_SIDEBAR_TILES = 5
const PARTICIPANT_SIDEBAR_ID = 'participant-sidebar'
const SIDEBAR_TILES_CONTAINER_ID = 'sidebar-tiles-container'
const SIDEBAR_ARROW_UP_ID = 'sidebar-arrow-up'
const SIDEBAR_ARROW_DOWN_ID = 'sidebar-arrow-down'

export class VideoGridUi {
  private sidebarScrollIndex: number = 0

  public constructor(private readonly ownParticipantId: string) {}

  public addParticipantTile(participant: Participant): void {
    const grid = this.getGrid()
    if (grid === null) return

    const tileId = `${PARTICIPANT_TILE_ID_PREFIX}${participant.identity}`
    if (document.getElementById(tileId) !== null) return

    const label = getParticipantDisplayName(participant)
    const tile = DomManager.jsxToDom(
      ParticipantTileComponent({
        participantId: participant.identity,
        displayName: label,
        heroSprite: getHeroSprite(label),
        isSelf: participant.identity === this.ownParticipantId,
      })
    )

    grid.appendChild(tile)
    this.updateGridLayout()
  }

  public updateParticipantName(participantId: string, displayName: string): void {
    const tile = document.getElementById(`${PARTICIPANT_TILE_ID_PREFIX}${participantId}`)
    if (tile === null) return
    const nameSpan = tile.querySelector(`.${videoGridStyles.name}`)
    if (nameSpan !== null) {
      const trimmed = displayName.trim()
      const safeName = trimmed !== '' ? trimmed : participantId
      const label = participantId === this.ownParticipantId ? `${safeName} (自分)` : safeName
      nameSpan.textContent = label
    }
    const avatarEl = tile.querySelector(`.${videoGridStyles.avatar}`)
    if (avatarEl !== null) {
      ;(avatarEl as HTMLElement).style.backgroundImage = `url(${getHeroSprite(displayName)})`
    }
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

  public detachTrack(participantId: string, kind: Track.Kind): void {
    if (kind === Track.Kind.Video) {
      const container = document.getElementById(`${VIDEO_CONTAINER_ID_PREFIX}${participantId}`)
      const avatarContainer = document.getElementById(`${AVATAR_CONTAINER_ID_PREFIX}${participantId}`)
      if (container !== null) {
        while (container.firstChild !== null) {
          container.removeChild(container.firstChild)
        }
        container.style.display = 'none'
      }
      if (avatarContainer !== null) {
        avatarContainer.style.display = 'flex'
      }
    }
  }

  public attachScreenShareTrack(track: RemoteTrack | Track, participantId: string, displayName: string): void {
    const grid = this.getGrid()
    if (grid === null) return

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
    const displayLabel = participantId === this.ownParticipantId ? `${displayName} (自分)` : displayName
    name.textContent = `${displayLabel}の画面`
    nameBar.appendChild(name)

    tile.appendChild(videoArea)
    tile.appendChild(nameBar)
    grid.insertBefore(tile, grid.firstChild)

    this.updateGridLayout()
  }

  public detachScreenShareTrack(participantId?: string): void {
    const grid = this.getGrid()
    if (grid === null) return

    const removeTile = (tile: Element): void => {
      tile.querySelectorAll('video, audio').forEach((el) => {
        el.remove()
      })
      tile.remove()
    }

    if (participantId !== undefined) {
      const tile = document.getElementById(`tile-screenshare-${participantId}`)
      if (tile !== null) {
        removeTile(tile)
      }
    } else {
      grid.querySelectorAll('[id^="tile-screenshare-"]').forEach((tile) => {
        removeTile(tile)
      })
    }

    this.updateGridLayout()
  }

  public updateGridLayout(): void {
    const grid = this.getGrid()
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
    const tilesContainer = this.getSidebarTilesContainer()
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

    let sidebar = document.getElementById(PARTICIPANT_SIDEBAR_ID)
    if (sidebar === null) {
      sidebar = document.createElement('div')
      sidebar.id = PARTICIPANT_SIDEBAR_ID
      sidebar.className = videoGridStyles.participantSidebar

      const arrowUp = document.createElement('button')
      arrowUp.className = `defaultStyle ${videoGridStyles.sidebarArrow}`
      arrowUp.textContent = '\u25B2'
      arrowUp.id = SIDEBAR_ARROW_UP_ID
      arrowUp.addEventListener('click', () => {
        this.scrollSidebar(-1)
      })

      const tilesContainer = document.createElement('div')
      tilesContainer.id = SIDEBAR_TILES_CONTAINER_ID
      tilesContainer.className = videoGridStyles.sidebarTilesContainer

      const arrowDown = document.createElement('button')
      arrowDown.className = `defaultStyle ${videoGridStyles.sidebarArrow}`
      arrowDown.textContent = '\u25BC'
      arrowDown.id = SIDEBAR_ARROW_DOWN_ID
      arrowDown.addEventListener('click', () => {
        this.scrollSidebar(1)
      })

      sidebar.appendChild(arrowUp)
      sidebar.appendChild(tilesContainer)
      sidebar.appendChild(arrowDown)
      grid.appendChild(sidebar)
      this.sidebarScrollIndex = 0
    }

    const tilesContainer = this.getSidebarTilesContainer()
    if (tilesContainer === null) return

    grid.querySelectorAll(':scope > [id^="tile-"]:not([id^="tile-screenshare-"])').forEach((tile) => {
      tilesContainer.appendChild(tile)
    })

    this.updateSidebarVisibility()
  }

  private removeScreenShareSidebar(grid: HTMLElement): void {
    const sidebar = document.getElementById(PARTICIPANT_SIDEBAR_ID)
    if (sidebar === null) return

    const tilesContainer = this.getSidebarTilesContainer()
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
    const tilesContainer = this.getSidebarTilesContainer()
    const upArrow = document.getElementById(SIDEBAR_ARROW_UP_ID)
    const downArrow = document.getElementById(SIDEBAR_ARROW_DOWN_ID)
    if (
      tilesContainer === null ||
      !(upArrow instanceof HTMLButtonElement) ||
      !(downArrow instanceof HTMLButtonElement)
    ) {
      return
    }

    const totalTiles = tilesContainer.children.length

    Array.from(tilesContainer.children).forEach((tile, index) => {
      const el = tile as HTMLElement
      el.style.display =
        index >= this.sidebarScrollIndex && index < this.sidebarScrollIndex + MAX_VISIBLE_SIDEBAR_TILES ? '' : 'none'
    })

    const showArrows = totalTiles > MAX_VISIBLE_SIDEBAR_TILES
    upArrow.style.display = showArrows ? '' : 'none'
    downArrow.style.display = showArrows ? '' : 'none'
    upArrow.disabled = this.sidebarScrollIndex <= 0
    downArrow.disabled = this.sidebarScrollIndex >= totalTiles - MAX_VISIBLE_SIDEBAR_TILES
  }

  private getGrid(): HTMLElement | null {
    const grid = document.getElementById(VIDEO_GRID_ID)
    if (grid === null) {
      console.error('[VideoGridUi] video-grid element not found!')
    }
    return grid
  }

  private getSidebarTilesContainer(): HTMLElement | null {
    return document.getElementById(SIDEBAR_TILES_CONTAINER_ID)
  }
}
