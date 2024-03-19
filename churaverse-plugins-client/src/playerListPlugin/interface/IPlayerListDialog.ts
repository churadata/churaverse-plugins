import { IDialog } from '../../coreUiPlugin/interface/IDialog'
import { PlayerListSection } from '../playerListDialog/playerListSection'

export interface IPlayerListDialog extends IDialog<PlayerListSection> {}

declare module '../../coreUiPlugin/interface/IDialogSwitcher' {
  export interface DialogMap {
    playerList: IPlayerListDialog
  }
}
