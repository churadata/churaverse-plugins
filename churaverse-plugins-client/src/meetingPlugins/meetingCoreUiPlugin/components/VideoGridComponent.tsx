import { JSXFunc } from 'churaverse-engine-client'
import style from './VideoGridComponent.module.scss'

interface Participant {
  id: number
  name: string
  isMuted: boolean
  isCameraOff: boolean
  avatarColor: string
}

const DUMMY_PARTICIPANTS: Participant[] = [
  { id: 1, name: 'User 1', isMuted: false, isCameraOff: false, avatarColor: '#4285f4' },
  { id: 2, name: 'User 2', isMuted: false, isCameraOff: true, avatarColor: '#ea4335' },
  { id: 3, name: 'User 3', isMuted: true, isCameraOff: false, avatarColor: '#fbbc04' },
  { id: 4, name: 'User 4', isMuted: true, isCameraOff: true, avatarColor: '#34a853' },
  { id: 5, name: 'User 5', isMuted: true, isCameraOff: true, avatarColor: '#673ab7' },
  { id: 6, name: 'User 6', isMuted: false, isCameraOff: true, avatarColor: '#e91e63' },
  { id: 7, name: 'You', isMuted: false, isCameraOff: false, avatarColor: '#00bcd4' },
]

const getInitials = (name: string): string => {
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

const ParticipantTile = ({ participant }: { participant: Participant }): JSX.Element => {
  return (
    <div className={style.participantTile}>
      <div className={style.videoArea}>
        <div className={style.avatarContainer}>
          <div className={style.avatar} style={{ backgroundColor: participant.avatarColor }}>
            {getInitials(participant.name)}
          </div>
        </div>
      </div>
      <div className={style.nameBar}>
        <span className={style.name}>{participant.name}</span>
        {participant.isMuted && (
          <span className={style.micOffIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>
            </svg>
          </span>
        )}
      </div>
    </div>
  )
}

export const VideoGridComponent: JSXFunc = () => {
  const participants = DUMMY_PARTICIPANTS
  const count = participants.length

  const getGridClass = (): string => {
    if (count <= 1) return style.grid1
    if (count <= 2) return style.grid2
    if (count <= 4) return style.grid4
    if (count <= 6) return style.grid6
    return style.grid9
  }

  return (
    <div className={style.videoGridContainer}>
      <div className={`${style.videoGrid} ${getGridClass()}`}>
        {participants.map((p) => (
          <ParticipantTile key={p.id} participant={p} />
        ))}
      </div>
    </div>
  )
}
