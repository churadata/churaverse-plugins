import { GameIds } from '../interface/gameIds'
import { IGameDescriptionWindow } from './IGameDescriptionWindow'

export interface IGameDescriptionDialogManager {
  add: (gameId: GameIds, dialog: IGameDescriptionWindow) => void
  showDescription: (gameId: GameIds) => void
  closeDescription: () => void
}
