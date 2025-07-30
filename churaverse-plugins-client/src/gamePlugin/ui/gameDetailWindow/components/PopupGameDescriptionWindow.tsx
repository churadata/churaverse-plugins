import { JSXFunc } from 'churaverse-engine-client'
import style from './PopupGameDescriptionWindow.module.scss'
import { GameIds } from '../../../interface/gameIds'
import { GAME_DESCRIPTION_CLOSE_BUTTON_ID, GAME_DESCRIPTION_CONTAINER_ID } from '../gameDescriptionWindow'

export const PopupGameDescriptionWindow: JSXFunc<any> = ({
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

      <div className={style.buttonsContainer}>
        <button className={style.closeButton} id={GAME_DESCRIPTION_CLOSE_BUTTON_ID(gameId)} type="button">
          閉じる
        </button>
      </div>
    </div>
  )
}
