import { Room, RoomEvent, Participant, RemoteParticipant } from 'livekit-client'
import { getParticipantDisplayName } from '@churaverse/livekit-client'
import style from './MeetingParticipantPanelComponent.module.scss'

const PLAYER_LIST_ID = 'player-list'
const MEETING_PARTICIPANT_LIST_ID = 'meeting-participant-list'
const MEETING_PARTICIPANT_DIVIDER_ID = 'meeting-participant-divider'

export class MeetingParticipantPanel {
  private listElement: HTMLElement | null = null
  private dividerElement: HTMLElement | null = null

  public constructor(private readonly room: Room) {
    this.setupRoomEventListeners()
    this.waitForConnectionAndRender()
  }

  private ensureElements(): boolean {
    if (this.listElement !== null) return true

    const playerList = document.getElementById(PLAYER_LIST_ID)
    if (playerList === null) return false

    const parent = playerList.parentElement
    if (parent === null) return false

    this.dividerElement = document.createElement('div')
    this.dividerElement.id = MEETING_PARTICIPANT_DIVIDER_ID
    this.dividerElement.className = style.divider
    this.dividerElement.textContent = 'ゲームモードOFFの参加者'
    parent.appendChild(this.dividerElement)

    this.listElement = document.createElement('div')
    this.listElement.id = MEETING_PARTICIPANT_LIST_ID
    this.listElement.className = style.meetingList
    parent.appendChild(this.listElement)

    return true
  }

  private waitForConnectionAndRender(): void {
    if (this.room.state === 'connected') {
      this.renderMeetingParticipants()
      return
    }
    this.room.once(RoomEvent.Connected, () => {
      this.renderMeetingParticipants()
    })
  }

  private setupRoomEventListeners(): void {
    this.room
      .on(RoomEvent.ParticipantConnected, () => {
        this.renderMeetingParticipants()
      })
      .on(RoomEvent.ParticipantDisconnected, () => {
        this.renderMeetingParticipants()
      })
      .on(RoomEvent.TrackMuted, () => {
        this.renderMeetingParticipants()
      })
      .on(RoomEvent.TrackUnmuted, () => {
        this.renderMeetingParticipants()
      })
      .on(RoomEvent.ParticipantNameChanged, () => {
        this.renderMeetingParticipants()
      })
  }

  private renderMeetingParticipants(): void {
    if (!this.ensureElements()) return
    if (this.listElement === null || this.dividerElement === null) return

    while (this.listElement.firstChild !== null) {
      this.listElement.removeChild(this.listElement.firstChild)
    }

    const meetingOnlyParticipants: Participant[] = []
    this.room.participants.forEach((participant: RemoteParticipant) => {
      const isMeetingOnlyUser = participant.identity.startsWith('meeting-')
      if (isMeetingOnlyUser) {
        meetingOnlyParticipants.push(participant)
      }
    })

    if (meetingOnlyParticipants.length === 0) {
      this.dividerElement.style.display = 'none'
      this.listElement.style.display = 'none'
      return
    }

    this.dividerElement.style.display = ''
    this.listElement.style.display = ''

    meetingOnlyParticipants.forEach((participant) => {
      this.addParticipantItem(participant)
    })
  }

  private addParticipantItem(participant: Participant): void {
    if (this.listElement === null) return

    const item = document.createElement('div')
    item.className = style.listRow

    const nameSpan = document.createElement('div')
    nameSpan.className = style.participantName
    nameSpan.textContent = getParticipantDisplayName(participant)
    item.appendChild(nameSpan)

    const micIcon = document.createElement('span')
    micIcon.className = `${style.micIcon} ${participant.isMicrophoneEnabled ? style.micOn : style.micOff}`
    micIcon.textContent = participant.isMicrophoneEnabled ? 'Mic' : 'Mute'
    item.appendChild(micIcon)

    this.listElement.appendChild(item)
  }
}
