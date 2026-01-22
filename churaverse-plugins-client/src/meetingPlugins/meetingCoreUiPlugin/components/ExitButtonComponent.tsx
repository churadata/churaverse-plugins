import { JSXFunc } from 'churaverse-engine-client'
import style from './ExitButtonComponent.module.scss'

export const ExitButtonComponent: JSXFunc = () => {
  return (
    <div className={style.container}>
      <button className={style.button} id="meeting-exit-button">
        <span className={style.icon}>🚪</span>
        <span className={style.label}>退出</span>
      </button>
    </div>
  )
}
