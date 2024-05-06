import { IDialog } from '@churaverse/core-ui-plugin-client/domain/interface/IRender/IDialog'
import { PlayerListSection } from '../playerListDialog/playerListSection'
import '@churaverse/core-ui-plugin-client/interface/IDialogSwitcher'

export interface IPlayerListDialog extends IDialog<PlayerListSection> {}

declare module '@churaverse/core-ui-plugin-client/interface/IDialogSwitcher' {
  export interface DialogMap {
    playerList: IPlayerListDialog
  }
}
