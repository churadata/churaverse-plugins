import { PlayerRole } from '../../../playerPlugin/types/playerRole'

export interface IJoinButtonRenderer {
  changeButtonColor: (role: PlayerRole) => void
}
