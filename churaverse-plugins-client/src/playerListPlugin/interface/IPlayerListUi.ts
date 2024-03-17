import { ITopBarIconRenderer } from '../../coreUiPlugin/interface/IDialogIconRenderer'
import { IPlayerListRenderer } from './IPlayerListRenderer'
import { IPlayerListDialog } from './IPlayerListDialog'

export interface IPlayerListUi {
  playerListDialog: IPlayerListDialog
  playerListIcon: ITopBarIconRenderer
  playerList: IPlayerListRenderer
}
