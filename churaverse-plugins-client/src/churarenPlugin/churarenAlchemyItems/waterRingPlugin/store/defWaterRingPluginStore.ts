import { WaterRingRepository } from '../repository/waterRingRepository'
import { IWaterRingAttackRenderer } from '../domain/IWaterRingAttackRenderer'
import { IWaterRingAttackRendererFactory } from '../domain/IWaterRingAttackRendererFactory'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    churarenWaterRingPlugin: WaterRingPluginStore
  }
}

export interface WaterRingPluginStore {
  readonly waterRings: WaterRingRepository
  readonly waterRingAttackRenderers: Map<string, IWaterRingAttackRenderer>
  readonly waterRingAttackRendererFactory: IWaterRingAttackRendererFactory
}
