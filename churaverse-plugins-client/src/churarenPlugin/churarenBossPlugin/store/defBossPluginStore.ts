import { IBossRenderer } from "../domain/IBossRenderer"
import { IBossRendererFactory } from "../domain/IBossRendererFactory"
import { IDamageCauseLogRenderer } from "../interface/IDamageCauseLogRenderer"
import { BossRepository } from "../repository/bossRepository"
import { DamageCauseLogRepository } from "../ui/damageCauseLog/deathLogRepository"

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    bossPlugin: BossPluginStore
  }
}

export interface BossPluginStore {
  readonly bosses: BossRepository
  readonly bossRenderers: Map<string, IBossRenderer>
  readonly bossRendererFactory: IBossRendererFactory
  readonly damageCauseLogRenderer: IDamageCauseLogRenderer
  readonly damageCauseLogRepository: DamageCauseLogRepository
}
