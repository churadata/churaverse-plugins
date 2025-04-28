import { JSXFunc } from 'churaverse-engine-client'
import style from './CountdownWindowComponent.module.scss'
import { CHURAREN_GAME_START_COUNTDOWN_ID } from '../countdownWindow'

export const CountdownWindowComponent: JSXFunc = () => {
  return (
    <div className={style.container}>
      <div className={style.timer} id={CHURAREN_GAME_START_COUNTDOWN_ID}></div>
    </div>
  )
}
