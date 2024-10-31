import { JSXFunc } from 'churaverse-engine-client'
import { RANKING_OPEN_BUTTON_ID } from '../rankingBoard'
import style from './RankingOpenButtonComponent.module.scss'

export const RankingOpenButtonComponent: JSXFunc = () => {
  return (
    <div className={style.rankingOpenButtonContainer} id={RANKING_OPEN_BUTTON_ID}>
      <button className={style.rankingOpenButton} type="button">
        ランキングを表示
      </button>
    </div>
  )
}
