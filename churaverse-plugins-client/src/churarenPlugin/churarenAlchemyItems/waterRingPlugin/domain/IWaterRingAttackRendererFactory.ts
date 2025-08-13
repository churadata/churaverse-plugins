import { IWaterRingAttackRenderer } from './IWaterRingAttackRenderer'

export interface IWaterRingAttackRendererFactory {
  build: () => IWaterRingAttackRenderer
}
