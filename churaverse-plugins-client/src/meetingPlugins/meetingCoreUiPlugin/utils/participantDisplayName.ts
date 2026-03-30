import { Participant } from 'livekit-client'

/** LiveKit の name が空文字のとき ?? では identity に落ちないため、表示用に統一する */
export function getParticipantDisplayName(participant: Pick<Participant, 'name' | 'identity'>): string {
  const n = participant.name?.trim()
  return n !== undefined && n !== '' ? n : participant.identity
}
