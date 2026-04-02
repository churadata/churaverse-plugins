import { JSXFunc } from 'churaverse-engine-client'
import { SEND_BUTTON_ID, TEXT_FIELD_ID } from '../renameForm'
import dialogStyle from '@churaverse/core-ui-plugin-client/settingDialog/style.module.scss'
import style from './RenameComponent.module.scss'

interface Props {
  readonly defaultName: string
}

export const RenameFormComponent: JSXFunc<Props> = ({ defaultName }: Props) => {
  return (
    <div className={style.container}>
      <div className={dialogStyle.itemLabel}>プレイヤー名</div>
      <div className={style.inputRow}>
        <div className={style.inputWrapper}>
          <input
            className={style.textField}
            type="text"
            id={TEXT_FIELD_ID}
            placeholder="Enter your name"
            defaultValue={defaultName}
          />
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
            <circle className={style.meter} cx="18" cy="18" r="15.9" id="rename-meter" />
          </svg>
          <span className={style.count} id="rename-count">0</span>
        </div>
        <button className={style.sendButton} id={SEND_BUTTON_ID}>
          OK
        </button>
      </div>
    </div>
  )
}
