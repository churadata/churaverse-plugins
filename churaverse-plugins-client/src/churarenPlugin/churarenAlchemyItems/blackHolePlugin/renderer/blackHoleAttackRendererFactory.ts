import { Scene } from 'phaser'
import { IBlackHoleAttackRendererFactory } from '../domain/IBlackHoleAttackRendererFactory'
import { IBlackHoleAttackRenderer } from '../domain/IBlackHoleAttackRenderer'
import { BlackHoleAttackRenderer } from './blackHoleAttackRenderer'

export class BlackHoleAttackRendererFactory implements IBlackHoleAttackRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(): IBlackHoleAttackRenderer {
    return new BlackHoleAttackRenderer(this.scene)
  }
}
