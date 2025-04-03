import { JSXFunc } from 'churaverse-engine-client'
import { ROW_CONTENT_CONTAINER_CLASS_NAME } from '../resultScreen'
import first from '../../../assets/1st.png'
import second from '../../../assets/2nd.png'
import third from '../../../assets/3rd.png'
import underFourth from '../../../assets/under4th.png'

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
  let rankColorClass: string
  let rankSuffix: string
  let src: string

  // 順位に応じて色と画像パスを設定
  if (rank === 1) {
    rankColorClass = style.gold
    rankSuffix = 'st'
    src = first
  } else if (rank === 2) {
    rankColorClass = style.silver
    rankSuffix = 'nd'
    src = second
  } else if (rank === 3) {
    rankColorClass = style.bronze
    rankSuffix = 'rd'
    src = third
  } else {
    rankColorClass = style.black
    rankSuffix = 'th'
    src = underFourth
  }

  return (
    <div className={`${style.listRow} ${rankColorClass}`}>
      <div className={style.player}>
        <img src={src} className={style.crownImage} />
        <div className={style.rank}>{`${rank}${rankSuffix}`}</div>
        <div className={style.playerName}>{playerName}</div>
        <div className={style.coinValue}>{coinValue}</div>
      </div>
      <div className={`${ROW_CONTENT_CONTAINER_CLASS_NAME}`}></div>
    </div>
  )
}
