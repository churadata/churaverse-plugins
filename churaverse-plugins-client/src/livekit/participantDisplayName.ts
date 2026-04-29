import { Participant } from 'livekit-client'

/** LiveKit Participant の表示名を取得する。name が未設定/空白なら identity を fallback とする */
export function getParticipantDisplayName(participant: Pick<Participant, 'name' | 'identity'>): string {
  const n = participant.name?.trim()
  return n !== undefined && n !== '' ? n : participant.identity
}
