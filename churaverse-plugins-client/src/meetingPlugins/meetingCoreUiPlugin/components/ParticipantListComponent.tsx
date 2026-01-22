import { JSXFunc } from 'churaverse-engine-client'
import style from './ParticipantListComponent.module.scss'

const PARTICIPANT_COUNT = 11

export const ParticipantListComponent: JSXFunc = () => {
  const participants = Array.from({ length: PARTICIPANT_COUNT }, (_, i) => i)

  return (
    <div className={style.container}>
      <div className={style.title}>参加者</div>
      <div className={style.participantGrid}>
        {participants.map((index) => (
          <div key={index} className={style.participantIcon}>
            <div className={style.participantAvatar}></div>
          </div>
        ))}
      </div>
    </div>
  )
}
