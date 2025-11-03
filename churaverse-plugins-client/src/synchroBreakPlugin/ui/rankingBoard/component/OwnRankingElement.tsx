import style from './OwnRankingElement.module.scss'
import { JSXFunc } from 'churaverse-engine-client'
import {
  MY_RANKING_CONTAINER_ID,
  MY_RANKING_RANK_ID,
  MY_RANKING_NAME_ID,
  MY_RANKING_COINS_ID,
  MY_RANKING_STATUS_ID,
} from '../ownRankingBoard'

export const OwnRankingElement: JSXFunc = () => {
  return (
    <div id={MY_RANKING_CONTAINER_ID} className={style.container}>
      <div className={style.myRankingInfo}>
        <div className={style.rankSection}>
          <span className={style.label}>順位:</span>
          <span id={MY_RANKING_RANK_ID} className={style.rank}>
            -
          </span>
        </div>
        <div className={style.infoSection}>
          <span id={MY_RANKING_NAME_ID} className={style.name}>
            -
          </span>
          <div className={style.coinStatusSection}>
            <span id={MY_RANKING_COINS_ID} className={style.coins}>
              -
            </span>
            <span id={MY_RANKING_STATUS_ID} className={style.status} data-status="yet">
              yet
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
