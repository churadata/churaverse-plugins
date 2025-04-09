import { Dialog } from '@churaverse/core-ui-plugin-client/dialog/dialog'
import { Props } from '@churaverse/core-ui-plugin-client/dialog/components/Panel'
import { ChurarenSection } from './churarenSection'
import { IChurarenDialog } from '../../interface/IChurarenDialog'

/** メインカラー */
export const PRIMARY_COLOR = 'gray'

export class ChurarenDialog extends Dialog<ChurarenSection> implements IChurarenDialog {
  public constructor() {
    const props: Props = {
      dialogName: 'ちゅられん',
    }
    super(props)
  }

  public static build(): Dialog<ChurarenSection> {
    return new ChurarenDialog()
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ChurarenDialogSectionMap {
  churaren: ChurarenSection
}
