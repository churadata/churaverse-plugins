import { GameIds } from '../interface/gameIds'
import { GameDescriptionDialogState, IGameDescriptionDialog } from './IGameDescriptionDialog'

export interface IGameDescriptionDialogManager {
  add: (gameId: GameIds, dialog: IGameDescriptionDialog) => void
  showDialog: (gameId: GameIds, status: GameDescriptionDialogState) => void
  closeDialog: () => void
}
