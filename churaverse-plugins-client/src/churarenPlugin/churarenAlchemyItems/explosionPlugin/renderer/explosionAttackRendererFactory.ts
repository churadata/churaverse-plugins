import { Scene } from 'phaser'
import { IExplosionAttackRenderer } from '../domain/IExplosionAttckRenderer'
import { IExplosionAttackRendererFactory } from '../domain/IExplosionAttackRendererFactory'
import { ExplosionAttackRenderer } from './explosionAttackRenderer'

export class ExplosionAttackRendererFactory implements IExplosionAttackRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(): IExplosionAttackRenderer {
    return new ExplosionAttackRenderer(this.scene)
  }
}
