import { GameIds } from '../interface/gameIds'
import { IGameDescriptionDialog } from './IGameDescriptionDialog'

export interface IGameDescriptionDialogManager {
  add: (gameId: GameIds, dialog: IGameDescriptionDialog) => void
  showDescription: (gameId: GameIds) => void
  closeDescription: () => void
}
