import { JSXFunc } from 'churaverse-engine-client'
import style from './GameStartCount.module.scss'
import { GAME_START_COUNT_ID } from '../gameStartCount'

export const GameStartCountComponent: JSXFunc = () => {
  return (
    <div className={style.container}>
      <div className={style.timeDisplay} id={GAME_START_COUNT_ID}></div>
    </div>
  )
}
