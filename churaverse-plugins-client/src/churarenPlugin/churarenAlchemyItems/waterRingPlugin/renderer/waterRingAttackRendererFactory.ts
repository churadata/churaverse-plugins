import { Scene } from 'phaser'
import { IWaterRingAttackRenderer } from '../domain/IWaterRingAttackRenderer'
import { IWaterRingAttackRendererFactory } from '../domain/IWaterRingAttackRendererFactory'
import { WaterRingAttackRenderer } from './waterRingAttackRenderer'

export class WaterRingAttackRendererFactory implements IWaterRingAttackRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(): IWaterRingAttackRenderer {
    return new WaterRingAttackRenderer(this.scene)
  }
}
