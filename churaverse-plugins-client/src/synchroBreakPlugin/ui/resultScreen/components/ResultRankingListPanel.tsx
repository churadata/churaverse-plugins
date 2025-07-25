import { JSXFunc } from 'churaverse-engine-client'
import { RESULT_LIST_ID, RESULT_CONTAINER_ID } from '../resultScreen'
import style from './ResultRankingListPanel.module.scss'
import resultStyle from './ResultStyle.module.scss'

export const ResultRankingListPanel: JSXFunc = () => {
  return (
    <div className={resultStyle.container}>
      <div className={resultStyle.dialogLabel}>
        <div id={RESULT_CONTAINER_ID}></div>
      </div>
      <div id={RESULT_LIST_ID} className={style.playerList}></div>
    </div>
  )
}
