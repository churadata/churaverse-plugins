import { Room, RoomEvent, Participant, RemoteParticipant, TrackPublication } from 'livekit-client'
import style from './MeetingParticipantPanelComponent.module.scss'

const PLAYER_LIST_ID = 'player-list'
const MEETING_PARTICIPANT_LIST_ID = 'meeting-participant-list'
const MEETING_PARTICIPANT_DIVIDER_ID = 'meeting-participant-divider'

/**
 * 既存の参加者一覧ダイアログにLiveKitミーティング参加者セクションを注入するクラス
 */
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

    // 区切り線
    this.dividerElement = document.createElement('div')
    this.dividerElement.id = MEETING_PARTICIPANT_DIVIDER_ID
    this.dividerElement.className = style.divider
    this.dividerElement.textContent = '会議のみ参加者'
    parent.appendChild(this.dividerElement)

    // 会議参加者リスト
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
      .on(RoomEvent.ParticipantConnected, (_participant: RemoteParticipant) => {
        this.renderMeetingParticipants()
      })
      .on(RoomEvent.ParticipantDisconnected, (_participant: RemoteParticipant) => {
        this.renderMeetingParticipants()
      })
      .on(RoomEvent.TrackMuted, (_publication: TrackPublication, _participant: Participant) => {
        this.renderMeetingParticipants()
      })
      .on(RoomEvent.TrackUnmuted, (_publication: TrackPublication, _participant: Participant) => {
        this.renderMeetingParticipants()
      })
  }

  private renderMeetingParticipants(): void {
    if (!this.ensureElements()) return
    if (this.listElement === null || this.dividerElement === null) return

    while (this.listElement.firstChild !== null) {
      this.listElement.removeChild(this.listElement.firstChild)
    }

    // ゲームプレイヤー以外の会議参加者を収集
    const meetingOnlyParticipants: Participant[] = []

    // ローカル参加者は常にゲームプレイヤーなのでスキップ
    this.room.participants.forEach((participant: RemoteParticipant) => {
      // ゲームプレイヤーはPlayerPluginが管理するのでスキップ
      // ゲームプレイヤーのidentityはsocket IDの形式（ランダムな英数字20文字）
      // MeetingScene参加者のidentityはプレイヤー名（日本語など）
      // ゲームのプレイヤーDOMが存在するかで判定
      const isGamePlayer = document.getElementById(`player-${participant.identity}`) !== null
      if (!isGamePlayer) {
        meetingOnlyParticipants.push(participant)
      }
    })

    // 会議のみ参加者がいない場合はセクションを非表示
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
    const displayName = participant.name ?? participant.identity
    nameSpan.textContent = displayName
    item.appendChild(nameSpan)

    const micIcon = document.createElement('div')
    micIcon.className = style.micIcon
    this.setMicIcon(micIcon, participant.isMicrophoneEnabled)
    item.appendChild(micIcon)

    this.listElement.appendChild(item)
  }

  private setMicIcon(container: HTMLElement, isMicEnabled: boolean): void {
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
      container.className = `${style.micIcon} ${style.micOn}`
    } else {
      path.setAttribute(
        'd',
        'M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z'
      )
      container.className = `${style.micIcon} ${style.micOff}`
    }

    svg.appendChild(path)
    container.appendChild(svg)
  }
}
