import { IBossAttackRenderer } from '../domain/IBossAttackRenderer'
import { IBossAttackRendererFactory } from '../domain/IBossAttackRendererFactory'
import { Scene } from 'phaser'
import { BossAttackRenderer } from './bossAttackRenderer'

export class BossAttackRendererFactory implements IBossAttackRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(): IBossAttackRenderer {
    return new BossAttackRenderer(this.scene)
  }
}
