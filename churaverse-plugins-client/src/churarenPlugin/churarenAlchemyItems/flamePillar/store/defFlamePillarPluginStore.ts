import { FlamePillarRepository } from '../repository/flamePillarRepository'
import { IFlamePillarAttackRenderer } from '../domain/IFlamePillarAttackRenderer'
import { IFlamePillarAttackRendererFactory } from '../domain/IFlamePillarAttackRendererFactory'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    churarenFlamePillarPlugin: FlamePillarPluginStore
  }
}

export interface FlamePillarPluginStore {
  readonly flamePillars: FlamePillarRepository
  readonly flamePillarAttackRenderers: Map<string, IFlamePillarAttackRenderer>
  readonly flamePillarAttackRendererFactory: IFlamePillarAttackRendererFactory
}
