import { JSXFunc } from 'churaverse-engine-client'
import style from './gameModeSelectorComponent.module.scss'

export const GameModeSelectorComponent: JSXFunc = () => {
  return (
    <div className={style.container}>
      <label className={style.label}>
        <input
          className={style.checkbox}
          type="checkbox"
          id="game-mode-checkbox"
          defaultChecked={false}
        />
        <span className={style.labelText}>ゲームモードを有効にする</span>
      </label>
    </div>
  )
}

