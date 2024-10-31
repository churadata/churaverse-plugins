import { JSXFunc } from 'churaverse-engine-client'
import { ROW_CONTENT_CONTAINER_CLASS_NAME } from '../../rankingList/rankingList'
import style from './ResultRankingListItem.module.scss'

interface Props {
  rank: number
  playerName: string
  coinValue: number
}

/**
 * プレイヤー一人分のコンポーネント
 */
export const ResultRankingListItem: JSXFunc<Props> = ({ rank, playerName, coinValue }: Props) => {
  let rankColorClass = ''
  // 順位に応じて色を設定
  if (rank === 1) {
    rankColorClass = style.gold
  } else if (rank === 2) {
    rankColorClass = style.silver
  } else if (rank === 3) {
    rankColorClass = style.bronze
  } else {
    rankColorClass = style.black
  }

  return (
    <div className={`${style.listRow} ${rankColorClass}`}>
      <div className={style.playerName}>
        {rank}位 {playerName} {coinValue}
      </div>
      <div className={`${ROW_CONTENT_CONTAINER_CLASS_NAME}`}></div>
    </div>
  )
}
