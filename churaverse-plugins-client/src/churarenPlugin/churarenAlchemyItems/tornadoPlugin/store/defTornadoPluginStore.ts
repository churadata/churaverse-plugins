import { TornadoRepository } from '../repository/tornadoRepository'
import { ITornadoAttackRenderer } from '../domain/ITornadoAttckRenderer'
import { ITornadoAttackRendererFactory } from '../domain/ITornadoAttackRendererFactory'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    churarenTornadoPlugin: TornadoPluginStore
  }
}

export interface TornadoPluginStore {
  readonly tornados: TornadoRepository
  readonly tornadoAttackRenderers: Map<string, ITornadoAttackRenderer>
  readonly tornadoAttackRendererFactory: ITornadoAttackRendererFactory
}
