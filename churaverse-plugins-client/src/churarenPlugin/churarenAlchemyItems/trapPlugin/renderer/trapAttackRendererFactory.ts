import { Scene } from 'phaser'
import { ITrapAttackRenderer } from '../domain/ITrapAttackRenderer'
import { ITrapAttackRendererFactory } from '../domain/ITrapAttackRendererFactory'
import { TrapAttackRenderer } from './trapAttackRenderer'

export class TrapAttackRendererFactory implements ITrapAttackRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(): ITrapAttackRenderer {
    return new TrapAttackRenderer(this.scene)
  }
}
