import { BossAttackRepository } from '../repository/bossAttackRepository'
import { IBossAttackRenderer } from '../domain/IBossAttackRenderer'
import { IBossAttackRendererFactory } from '../domain/IBossAttackRendererFactory'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    bossAttackPlugin: BossAttackPluginStore
  }
}

export interface BossAttackPluginStore {
  readonly bossAttacks: BossAttackRepository
  readonly bossAttackRenderers: Map<string, IBossAttackRenderer>
  readonly bossAttackRendererFactory: IBossAttackRendererFactory
}
