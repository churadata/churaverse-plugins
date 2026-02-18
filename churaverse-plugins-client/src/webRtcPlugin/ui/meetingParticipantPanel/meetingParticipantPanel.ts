import { DomManager, domLayerSetting } from 'churaverse-engine-client'
import { Room, RoomEvent, Participant, RemoteParticipant, TrackPublication } from 'livekit-client'
import {
  MeetingParticipantPanelComponent,
  meetingParticipantPanelStyles as styles,
  PANEL_ID,
  PANEL_TOGGLE_ID,
  PANEL_COUNT_ID,
  PANEL_LIST_ID,
} from './MeetingParticipantPanelComponent'

export class MeetingParticipantPanel {
  private readonly panelElement: HTMLElement
  private readonly listElement: HTMLElement
  private readonly countElement: HTMLElement
  private isCollapsed: boolean = false

  public constructor(private readonly room: Room) {
    const panelRoot = DomManager.addJsxDom(MeetingParticipantPanelComponent())
    domLayerSetting(panelRoot, 'high')

    this.panelElement = DomManager.getElementById(PANEL_ID)
    this.listElement = DomManager.getElementById(PANEL_LIST_ID)
    this.countElement = DomManager.getElementById(PANEL_COUNT_ID)

    const toggleButton = DomManager.getElementById(PANEL_TOGGLE_ID)
    toggleButton.addEventListener('click', () => {
      this.isCollapsed = !this.isCollapsed
      this.panelElement.setAttribute('data-collapsed', String(this.isCollapsed))
    })

    this.setupRoomEventListeners()
    this.waitForConnectionAndRender()
  }

  private waitForConnectionAndRender(): void {
    if (this.room.state === 'connected') {
      this.renderAllParticipants()
      return
    }

    this.room.once(RoomEvent.Connected, () => {
      this.renderAllParticipants()
    })
  }

  private setupRoomEventListeners(): void {
    this.room
      .on(RoomEvent.ParticipantConnected, (_participant: RemoteParticipant) => {
        this.renderAllParticipants()
      })
      .on(RoomEvent.ParticipantDisconnected, (_participant: RemoteParticipant) => {
        this.renderAllParticipants()
      })
      .on(RoomEvent.TrackMuted, (_publication: TrackPublication, participant: Participant) => {
        this.updateMicStatus(participant)
      })
      .on(RoomEvent.TrackUnmuted, (_publication: TrackPublication, participant: Participant) => {
        this.updateMicStatus(participant)
      })
      .on(RoomEvent.LocalTrackPublished, () => {
        this.updateMicStatus(this.room.localParticipant)
      })
      .on(RoomEvent.LocalTrackUnpublished, () => {
        this.updateMicStatus(this.room.localParticipant)
      })
  }

  private renderAllParticipants(): void {
    while (this.listElement.firstChild !== null) {
      this.listElement.removeChild(this.listElement.firstChild)
    }

    this.addParticipantItem(this.room.localParticipant, true)

    this.room.participants.forEach((participant: RemoteParticipant) => {
      this.addParticipantItem(participant)
    })

    this.updateCount()
  }

  private addParticipantItem(participant: Participant, isLocal: boolean = false): void {
    const item = document.createElement('div')
    item.id = `meeting-participant-${participant.identity}`
    item.className = styles.participantItem

    const nameSpan = document.createElement('span')
    nameSpan.className = styles.participantName
    const displayName = participant.name ?? participant.identity
    nameSpan.textContent = displayName

    if (isLocal) {
      const selfLabel = document.createElement('span')
      selfLabel.className = styles.selfLabel
      selfLabel.textContent = ' (自分)'
      nameSpan.appendChild(selfLabel)
    }

    item.appendChild(nameSpan)

    const micStatus = document.createElement('span')
    micStatus.className = styles.micStatus
    micStatus.id = `meeting-participant-mic-${participant.identity}`
    this.setMicIcon(micStatus, participant.isMicrophoneEnabled)
    item.appendChild(micStatus)

    this.listElement.appendChild(item)
  }

  private updateMicStatus(participant: Participant): void {
    const micElement = document.getElementById(`meeting-participant-mic-${participant.identity}`)
    if (micElement === null) return
    this.setMicIcon(micElement, participant.isMicrophoneEnabled)
  }

  private setMicIcon(container: HTMLElement, isMicEnabled: boolean): void {
    while (container.firstChild !== null) {
      container.removeChild(container.firstChild)
    }

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', '14')
    svg.setAttribute('height', '14')
    svg.setAttribute('viewBox', '0 0 24 24')
    svg.setAttribute('fill', 'currentColor')

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')

    if (isMicEnabled) {
      path.setAttribute(
        'd',
        'M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z'
      )
      container.className = `${styles.micStatus} ${styles.micOn}`
    } else {
      path.setAttribute(
        'd',
        'M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z'
      )
      container.className = `${styles.micStatus} ${styles.micOff}`
    }

    svg.appendChild(path)
    container.appendChild(svg)
  }

  private updateCount(): void {
    const totalCount = 1 + this.room.participants.size
    this.countElement.textContent = `会議参加者 (${totalCount})`
  }
}
