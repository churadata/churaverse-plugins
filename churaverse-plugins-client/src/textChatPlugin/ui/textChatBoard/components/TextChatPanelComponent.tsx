import dialogStyle from '../../../../../plugins/coreUiPlugin/settingDialog/style.module.scss'
import { JSXFunc } from 'churaverse-engine-client'
import { TextChatBoardComponent } from './TextChatBoardComponent'
import { TextChatInputComponent } from '../../textChatInput/components/TextChatInputComponent'

export const TextChatDialogPanelComponent: JSXFunc = () => {
  return (
    <div className={dialogStyle.container}>
      <div className={dialogStyle.dialogLabel}>チャット</div>
      <TextChatBoardComponent />
      <TextChatInputComponent />
    </div>
  )
}
