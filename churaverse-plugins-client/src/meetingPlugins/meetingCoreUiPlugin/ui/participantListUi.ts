import { DomManager } from 'churaverse-engine-client'
import { Participant } from 'livekit-client'
import { PARTICIPANT_LIST_ID, PARTICIPANTS_COUNT_ID } from '../components/MeetingSidebarComponent'
import { ParticipantItemComponent } from '../components/ParticipantItemComponent'
import { getParticipantDisplayName } from '@churaverse/livekit-client'

export class ParticipantListUi {
  public constructor(private readonly ownParticipantId: string) {}

  public update(participants: Participant[]): void {
    const list = document.getElementById(PARTICIPANT_LIST_ID)
    if (list === null) return

    while (list.firstChild !== null) {
      list.replaceChildren(list.firstChild)
    }

    participants.forEach((p) => {
      const item = DomManager.jsxToDom(
        ParticipantItemComponent({
          displayName: getParticipantDisplayName(p),
          isSelf: p.identity === this.ownParticipantId,
          isMuted: !p.isMicrophoneEnabled,
        })
      )
      list.appendChild(item)
    })

    const countEl = document.getElementById(PARTICIPANTS_COUNT_ID)
    if (countEl !== null) {
      countEl.textContent = `参加者 (${participants.length})`
    }
  }
}
