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
      <div>
        <input
          className={style.textField}
          type="text"
          id={TEXT_FIELD_ID}
          placeholder="Enter your name"
          defaultValue={defaultName}
        />
        <button className={style.sendButton} id={SEND_BUTTON_ID}>
          OK
        </button>
      </div>
    </div>
  )
}
