import { JSXFunc } from 'churaverse-engine-client'
import { GAME_DESCRIPTION_CLOSE_BUTTON_ID } from '../gameDescriptionDialog'
import style from './CloseButtonComponent.module.scss'
import { GameIds } from '../../../interface/gameIds'

export const CloseButtonComponent: JSXFunc<any> = ({ gameId }: { gameId: GameIds }) => {
  return (
    <div className={style.buttonsContainer}>
      <button className={style.closeButton} id={GAME_DESCRIPTION_CLOSE_BUTTON_ID(gameId)} type="button">
        閉じる
      </button>
    </div>
  )
}
