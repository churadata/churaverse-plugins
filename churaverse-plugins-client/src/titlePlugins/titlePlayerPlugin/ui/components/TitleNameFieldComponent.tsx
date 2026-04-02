import { JSXFunc } from 'churaverse-engine-client'
import style from './titleNameFieldComponent.module.scss'

export const TitleNameFieldComponent: JSXFunc = () => {
  return (
    <div className={style.container}>
      <div className={style.inputWrapper}>
        <input className={style.textField} type="text" id="title-name-field" placeholder="Enter your name" />
        <div className={style.tooltip}>
          <ul>
            <li>1文字以上15文字以下</li>
            <li>連続するスペースは使用不可</li>
          </ul>
        </div>
      </div>
      <div className={style.indicator}>
        <svg viewBox="0 0 36 36" className={style.svg}>
          <circle className={style.track} cx="18" cy="18" r="15.9" />
          <circle className={style.meter} cx="18" cy="18" r="15.9" id="title-name-meter" />
        </svg>
        <span className={style.count} id="title-name-count">0</span>
      </div>
    </div>
  )
}
