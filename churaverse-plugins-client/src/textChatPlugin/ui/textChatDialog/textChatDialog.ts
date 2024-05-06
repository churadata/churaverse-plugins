import { Dialog } from '@churaverse/core-ui-plugin-client/dialog/dialog'
import { TextChatSection } from './textChatSection'
import { Props } from '@churaverse/core-ui-plugin-client/dialog/components/Panel'
import { ITextChatDialog } from '../interface/ITextChatDialog'

/**
 * プレイヤーの設定に関するUI
 */
export class TextChatDialog extends Dialog<TextChatSection> implements ITextChatDialog {
  public constructor() {
    const props: Props = {
      dialogName: 'チャット',
    }
    super(props)
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TextChatDialogSectionMap {}
