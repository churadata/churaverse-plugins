import { PlayerRole } from '@churaverse/player-plugin-client/types/playerRole'

export interface IJoinButtonRenderer {
  changeButtonColor: (role: PlayerRole) => void
}
