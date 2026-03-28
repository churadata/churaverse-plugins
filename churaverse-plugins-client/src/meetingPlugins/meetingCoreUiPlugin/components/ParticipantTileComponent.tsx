import { JSXFunc } from 'churaverse-engine-client'
import style from './VideoGridComponent.module.scss'

interface Props {
  participantId: string
  displayName: string
  avatarColor: string
  initials: string
  isSelf: boolean
}

export const PARTICIPANT_TILE_ID_PREFIX = 'tile-'
export const VIDEO_CONTAINER_ID_PREFIX = 'video-container-'
export const AVATAR_CONTAINER_ID_PREFIX = 'avatar-'

export const ParticipantTileComponent: JSXFunc<Props> = ({
  participantId,
  displayName,
  avatarColor,
  initials,
  isSelf,
}: Props) => {
  const label = isSelf ? `${displayName} (自分)` : displayName
  return (
    <div id={`${PARTICIPANT_TILE_ID_PREFIX}${participantId}`} className={style.participantTile}>
      <div className={style.videoArea}>
        <div
          id={`${VIDEO_CONTAINER_ID_PREFIX}${participantId}`}
          style={{ width: '100%', height: '100%', display: 'none', position: 'absolute', top: 0, left: 0 }}
        ></div>
        <div id={`${AVATAR_CONTAINER_ID_PREFIX}${participantId}`} className={style.avatarContainer}>
          <div className={style.avatar} style={{ backgroundColor: avatarColor }}>
            {initials}
          </div>
        </div>
      </div>
      <div className={style.nameBar}>
        <span className={style.name}>{label}</span>
      </div>
    </div>
  )
}
