import { JSXFunc } from 'churaverse-engine-client'
import style from './titleNameFieldComponent.module.scss'

export const TitleNameFieldComponent: JSXFunc = () => {
  return (
    <div className={style.container}>
      <input className={style.textField} type="text" id="title-name-field" placeholder="Enter your name" />
    </div>
  )
}
