import { DamageCauseType } from 'churaverse-engine-client'
import { DamageCauseLog } from '../ui/damageCauseLog/damageCauseLog'

export type DamageCauseLogMessageBuilder = (damageCauseLog: DamageCauseLog) => string

export interface IDamageCauseLogRenderer {
  add: (damageCauseLog: DamageCauseLog) => void
  addDamageCauseLogMessageBuilder: (
    damageCause: DamageCauseType,
    damageCauseLogMessageBuilder: DamageCauseLogMessageBuilder
  ) => void
}
