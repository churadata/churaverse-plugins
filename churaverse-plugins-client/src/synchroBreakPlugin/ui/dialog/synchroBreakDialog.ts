import { Dialog } from '@churaverse/core-ui-plugin-client/dialog/dialog'
import { Props } from '@churaverse/core-ui-plugin-client/dialog/components/Panel'
import { ISynchroBreakDialog } from '../../interface/ISynchroBreakDialog'
import { SynchroBreakSection } from './synchroBreakSection'

/** メインカラー */
export const PRIMARY_COLOR = 'lightsteelblue'

export class SynchroBreakDialog extends Dialog<SynchroBreakSection> implements ISynchroBreakDialog {
  public constructor() {
    const props: Props = {
      dialogName: 'シンクロブレイク',
    }
    super(props)
  }

  public static build(): Dialog<SynchroBreakSection> {
    return new SynchroBreakDialog()
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SynchroBreakDialogSectionMap {
  synchroBreak: SynchroBreakSection
}
