import { ITopBarIconRenderer } from '@churaverse/core-ui-plugin-client/interface/IDialogIconRenderer'
import { IPlayerListRenderer } from './IPlayerListRenderer'
import { IPlayerListDialog } from './IPlayerListDialog'

export interface IPlayerListUi {
  playerListDialog: IPlayerListDialog
  playerListIcon: ITopBarIconRenderer
  playerList: IPlayerListRenderer
}
