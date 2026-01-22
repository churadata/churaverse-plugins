import { JSXFunc } from 'churaverse-engine-client'
import style from './AudioControlButtonComponent.module.scss'

export const AudioControlButtonComponent: JSXFunc = () => {
  return (
    <div className={style.container}>
      <button className={style.button} id="mic-toggle-button">
        <span className={style.icon}>🎤</span>
        <span className={style.label}>マイク</span>
      </button>
      <button className={style.button} id="speaker-toggle-button">
        <span className={style.icon}>🔊</span>
        <span className={style.label}>スピーカー</span>
      </button>
    </div>
  )
}
