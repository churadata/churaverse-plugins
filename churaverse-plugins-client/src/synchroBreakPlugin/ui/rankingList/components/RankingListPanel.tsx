import { JSXFunc } from 'churaverse-engine-client'
import { RANKING_LIST_ID, RANKING_CONTAINER_ID } from '../rankingList'
import style from './RankingListPanel.module.scss'
import rankingStyle from './RankingStyle.module.scss'

export const RankingListPanel: JSXFunc = () => {
  return (
    <div className={rankingStyle.container}>
      <div className={rankingStyle.dialogLabel}>
        現在のランキング
        <div id={RANKING_CONTAINER_ID}></div>
      </div>
      <div id={RANKING_LIST_ID} className={style.playerList}></div>
    </div>
  )
}
