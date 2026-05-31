import { JSXFunc } from 'churaverse-engine-client'
import style from './CountdownTimerComponent.module.scss'
import { COUNTDOWN_TIMER_ID } from '../countdownTimer'

export const CountdownTimerComponent: JSXFunc = () => {
  return (
    <div className={style.countdownContainer}>
      <div className={style.countdownTimer} id={COUNTDOWN_TIMER_ID}></div>
    </div>
  )
}
