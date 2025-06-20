import style from './RankingBoardElement.module.scss'
import { JSXFunc } from 'churaverse-engine-client'
import {
  RANKING_BOARD_CONTAINER_ID,
  RANKING_BOARD_ELEMENT_CONTAINER_ID,
  RANKING_BOARD_ELEMENT_TURN_ID,
  RANKING_CLOSE_BUTTON_ID,
} from '../rankingBoard'

export const RankingBoardElement: JSXFunc = () => {
  return (
    <div id={RANKING_BOARD_CONTAINER_ID} className={style.container}>
      <div id={RANKING_BOARD_ELEMENT_TURN_ID} className={style.turn}></div>
      <div className={style.title}>ランキングボード</div>
      <div id={RANKING_BOARD_ELEMENT_CONTAINER_ID}></div>
      <button id={RANKING_CLOSE_BUTTON_ID} className={style.closeButton}>
        閉じる
      </button>
    </div>
  )
}
