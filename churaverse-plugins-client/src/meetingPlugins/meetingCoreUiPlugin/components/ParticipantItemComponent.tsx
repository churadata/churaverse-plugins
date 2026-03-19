import { JSXFunc } from 'churaverse-engine-client'
import style from './MeetingSidebarComponent.module.scss'
import micOffIcon from '../assets/microphone_off.png'

interface Props {
  displayName: string
  isSelf: boolean
  isMuted: boolean
}

export const ParticipantItemComponent: JSXFunc<Props> = ({ displayName, isSelf, isMuted }: Props) => {
  const label = isSelf ? `${displayName} (自分)` : displayName
  return (
    <div className={style.participantItem}>
      <div className={style.participantAvatar}>{displayName.slice(0, 1).toUpperCase()}</div>
      <span className={style.participantName}>{label}</span>
      {isMuted && <img src={micOffIcon} className={style.mutedIcon} width="16" height="16" alt="muted" />}
    </div>
  )
}
