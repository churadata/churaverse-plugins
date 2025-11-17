import { GameIds } from '../interface/gameIds'
import { IGameDescriptionDialog } from './IGameDescriptionDialog'

export interface IGameDescriptionDialogManager {
  add: (gameId: GameIds, dialog: IGameDescriptionDialog) => void
  showDialog: (gameId: GameIds) => void
  closeDialog: () => void
}
