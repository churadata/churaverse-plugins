import { JSXFunc } from 'churaverse-engine-client'
import style from './BetTimer.module.scss'
import { BET_TIMER_CONTAINER_ID, BET_TIMER_ID } from '../betTimer'

export const BetTimerComponent: JSXFunc = () => {
  return (
    <div className={style.betTimerContainer} id={BET_TIMER_CONTAINER_ID}>
      <div className={style.betTimer} id={BET_TIMER_ID}></div>
    </div>
  )
}
