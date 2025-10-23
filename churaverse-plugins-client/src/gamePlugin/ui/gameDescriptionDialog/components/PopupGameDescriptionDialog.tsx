import { JSXFunc } from 'churaverse-engine-client'
import style from './PopupGameDescriptionDialog.module.scss'
import { GameIds } from '../../../interface/gameIds'
import { GAME_DESCRIPTION_CONTAINER_ID } from '../gameDescriptionDialog'
import { CloseButtonComponent } from './CloseButtonComponent'
import { GameParticipationButtons } from './GameParticipationButtons'

export const PopupGameDescriptionDialog: JSXFunc<any> = ({
  gameId,
  gameName,
}: {
  gameId: GameIds
  gameName: string
}) => {
  return (
    <div className={style.windowContainer}>
      <div className={style.windowLabel}>{gameName}</div>
      <div id={GAME_DESCRIPTION_CONTAINER_ID(gameId)} className={style.detailContainer}>
        {/* ここに ゲームの説明を入れる */}
      </div>
      <GameParticipationButtons gameId={gameId} />
      <CloseButtonComponent gameId={gameId} />
    </div>
  )
}
