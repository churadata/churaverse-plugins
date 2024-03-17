import { DamageCauseType } from 'churaverse-engine-client'
import { Player } from '../../domain/player'

export interface DeathLog {
  readonly victim: Player
  readonly killer: Player
  readonly cause: DamageCauseType
  readonly diedTime: Date
}
