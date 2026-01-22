import { JSXFunc } from 'churaverse-engine-client'
import style from './ScreenShareButtonComponent.module.scss'

export const ScreenShareButtonComponent: JSXFunc = () => {
  return (
    <div className={style.container}>
      <button className={style.button} id="screen-share-button">
        <span className={style.icon}>📺</span>
        <span className={style.label}>画面共有</span>
      </button>
    </div>
  )
}
