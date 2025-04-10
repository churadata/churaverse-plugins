import { JSXFunc } from 'churaverse-engine-client'
import {
  TURN_SELECT_FIELD_ID,
  TURN_SELECT_INCREASE_BUTTON_ID,
  TURN_SELECT_DECREASE_BUTTON_ID,
  TURN_SELECT_SEND_BUTTON_ID,
  SYNCHRO_BREAK_MIN_TURN_SELECT,
  SYNCHRO_BREAK_MAX_TURN_SELECT,
} from '../turnSelectFormContainer'
import style from './SelectTurnForm.module.scss'

export const SelectTurnForm: JSXFunc = () => {
  return (
    <div className={style.turnSelectFormContainer}>
      <p>ターン選択</p>
      <button className={style.decrementButton} id={TURN_SELECT_DECREASE_BUTTON_ID}></button>
      <input
        type="number"
        className={style.turnSelectInput}
        defaultValue={SYNCHRO_BREAK_MIN_TURN_SELECT}
        min={SYNCHRO_BREAK_MIN_TURN_SELECT}
        max={SYNCHRO_BREAK_MAX_TURN_SELECT}
        step={1}
        id={TURN_SELECT_FIELD_ID}
      ></input>
      <button className={style.incrementButton} id={TURN_SELECT_INCREASE_BUTTON_ID}></button>
      <button className={style.sendButton} id={TURN_SELECT_SEND_BUTTON_ID}>
        OK
      </button>
    </div>
  )
}
