import { JSXFunc } from 'churaverse-engine-client'
import {
  TIME_LIMIT_DECREMENT_BUTTON_ID,
  TIME_LIMIT_INCREMENT_BUTTON_ID,
  TIME_LIMIT_INPUT_FIELD_ID,
  TIME_LIMIT_SEND_BUTTON_ID,
  MIN_TIME_LIMIT,
} from '../timeLimitFormContainer'
import style from './timeLimitForm.module.scss'

export const TimeLimitForm: JSXFunc = () => {
  return (
    <div className={style.timeLimitFormContainer}>
      <div className={style.instructionText}>
        <p>時間選択</p>
      </div>
      <button className={style.decrementButton} id={TIME_LIMIT_DECREMENT_BUTTON_ID} />
      <input
        type="text"
        className={style.timeLimitInput}
        defaultValue={MIN_TIME_LIMIT}
        min={MIN_TIME_LIMIT}
        id={TIME_LIMIT_INPUT_FIELD_ID}
      />
      <button className={style.incrementButton} id={TIME_LIMIT_INCREMENT_BUTTON_ID} />
      <button className={style.sendButton} id={TIME_LIMIT_SEND_BUTTON_ID}>
        OK
      </button>
    </div>
  )
}
