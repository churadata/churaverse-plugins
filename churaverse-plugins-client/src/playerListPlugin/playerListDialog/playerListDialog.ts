import { Dialog } from '../../coreUiPlugin/dialog/dialog'
import { PlayerListSection } from './playerListSection'
import { Props } from '../../coreUiPlugin/dialog/components/Panel'
import { IPlayerListDialog } from '../interface/IPlayerListDialog'

/**
 * Playerの一覧に関するUI
 */
export class PlayerListDialog extends Dialog<PlayerListSection> implements IPlayerListDialog {
  public constructor() {
    const props: Props = {
      dialogName: '参加者一覧',
    }
    super(props)
  }

  public static build(): Dialog<PlayerListSection> {
    return new PlayerListDialog()
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PlayerListDialogSectionMap {}
