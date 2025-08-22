import { GameIds } from './gameIds'
import { IGameExitAlertConfirm } from './IGameExitAlertConfirm'

export interface IGameExitAlertConfirmManager {
  add: (gameId: GameIds, alert: IGameExitAlertConfirm) => void
  showAlert: (gameId: GameIds, message?: string) => boolean
  closeAlert: () => void
}
