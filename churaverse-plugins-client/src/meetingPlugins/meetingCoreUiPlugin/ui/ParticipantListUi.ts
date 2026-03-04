import { DomManager } from 'churaverse-engine-client'
import { Participant } from 'livekit-client'
import { PARTICIPANT_LIST_ID, PARTICIPANTS_COUNT_ID } from '../components/MeetingSidebarComponent'
import { ParticipantItemComponent } from '../components/ParticipantItemComponent'

export class ParticipantListUi {
  public constructor(private readonly ownParticipantId: string) {}

  public update(participants: Participant[]): void {
    const list = document.getElementById(PARTICIPANT_LIST_ID)
    const countEl = document.getElementById(PARTICIPANTS_COUNT_ID)
    if (list === null) return

    while (list.firstChild !== null) {
      list.removeChild(list.firstChild)
    }

    participants.forEach((p) => {
      const item = DomManager.jsxToDom(
        ParticipantItemComponent({
          participantId: p.identity,
          isSelf: p.identity === this.ownParticipantId,
          isMuted: !p.isMicrophoneEnabled,
        })
      )
      list.appendChild(item)
    })

    if (countEl !== null) {
      countEl.textContent = `参加者 (${participants.length})`
    }
  }
}
