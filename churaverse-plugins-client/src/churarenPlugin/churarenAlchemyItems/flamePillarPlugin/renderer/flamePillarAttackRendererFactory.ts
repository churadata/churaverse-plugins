import { Scene } from 'phaser'
import { IFlamePillarAttackRenderer } from '../domain/IFlamePillarAttackRenderer'
import { IFlamePillarAttackRendererFactory } from '../domain/IFlamePillarAttackRendererFactory'
import { FlamePillarAttackRenderer } from './flamePillarAttackRenderer'

export class FlamePillarAttackRendererFactory implements IFlamePillarAttackRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(): IFlamePillarAttackRenderer {
    return new FlamePillarAttackRenderer(this.scene)
  }
}
