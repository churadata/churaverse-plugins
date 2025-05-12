import { IBossRenderer } from '../domain/IBossRenderer'
import { IBossRendererFactory } from '../domain/IBossRendererFactory'
import { IBossDamageCauseLogRenderer } from '../interface/IBossDamageCauseLogRenderer'
import { BossRepository } from '../repository/bossRepository'
import { BossDamageCauseLogRepository } from '../ui/damageCauseLog/bossDamageLogRepository'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    bossPlugin: BossPluginStore
  }
}

export interface BossPluginStore {
  readonly bosses: BossRepository
  readonly bossRenderers: Map<string, IBossRenderer>
  readonly bossRendererFactory: IBossRendererFactory
  readonly damageCauseLogRenderer: IBossDamageCauseLogRenderer
  readonly damageCauseLogRepository: BossDamageCauseLogRepository
}
