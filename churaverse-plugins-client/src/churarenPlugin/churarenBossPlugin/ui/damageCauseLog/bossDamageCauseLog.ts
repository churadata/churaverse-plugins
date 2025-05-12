import { Player } from '@churaverse/player-plugin-client/domain/player'
import { DamageCauseType } from 'churaverse-engine-client'

export interface BossDamageCauseLog {
  readonly attacker: Player
  readonly cause: DamageCauseType
  readonly damage: number
}
