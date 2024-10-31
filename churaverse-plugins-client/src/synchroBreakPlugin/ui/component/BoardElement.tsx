import style from '../style.module.scss'
import { JSXFunc } from 'churaverse-engine-client'
import {
  BOARD_ELEMENT_ID,
  PLAYER_NAME_ID,
  NYOKKI_STATUS_ID,
  PLAYER_COINS_ID,
  PLAYER_RANK_ID,
} from '../rankingBoard/rankingBoard'

export type NyokkiStatus = 'yet' | 'success' | 'nyokki'

export interface boardProps {
  readonly playerId: string
  readonly playerName: string
  rank: number
  readonly coins: number
  readonly status: NyokkiStatus
}

export const getRankColorClass = (rank: number): string => {
  switch (rank) {
    case 1:
      return style.gold
    case 2:
      return style.silver
    case 3:
      return style.bronze
    default:
      return style.black
  }
}

export const BoardElement: JSXFunc<boardProps> = (props: boardProps) => {
  const playerId: string = props.playerId

  return (
    <div id={BOARD_ELEMENT_ID(playerId)} className={style.boardElementContainer}>
      <div id={PLAYER_RANK_ID(playerId)} className={getRankColorClass(props.rank)}>{`${props.rank}位`}</div>
      <div id={PLAYER_NAME_ID(playerId)} className={style.playerId}>
        {props.playerName}
      </div>
      <div id={PLAYER_COINS_ID(playerId)}>{`${props.coins}コイン`}</div>
      <div id={NYOKKI_STATUS_ID(playerId)} className={`${style.status} ${style[props.status]}`}>
        {props.status}
      </div>
    </div>
  )
}
