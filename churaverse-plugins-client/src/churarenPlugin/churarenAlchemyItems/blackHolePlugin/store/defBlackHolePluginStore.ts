import { IBlackHoleAttackRendererFactory } from '../domain/IBlackHoleAttackRendererFactory'
import { IBlackHoleAttackRenderer } from '../domain/IBlackHoleAttackRenderer'
import { BlackHoleRepository } from '../repository/blackHoleRepository'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    churarenBlackHolePlugin: BlackHolePluginStore
  }
}

export interface BlackHolePluginStore {
  readonly blackHoles: BlackHoleRepository
  readonly blackHoleAttackRenderers: Map<string, IBlackHoleAttackRenderer>
  readonly blackHoleAttackRendererFactory: IBlackHoleAttackRendererFactory
}
