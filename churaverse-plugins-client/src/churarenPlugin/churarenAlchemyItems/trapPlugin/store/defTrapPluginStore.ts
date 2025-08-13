import { TrapRepository } from '../repository/trapRepository'
import { ITrapAttackRenderer } from '../domain/ITrapAttackRenderer'
import { ITrapAttackRendererFactory } from '../domain/ITrapAttackRendererFactory'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    churarenTrapPlugin: TrapPluginStore
  }
}

export interface TrapPluginStore {
  readonly traps: TrapRepository
  readonly trapAttackRenderers: Map<string, ITrapAttackRenderer>
  readonly trapAttackRendererFactory: ITrapAttackRendererFactory
}
