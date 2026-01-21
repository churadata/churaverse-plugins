import { Scene } from 'phaser'
import { ITornadoAttackRenderer } from '../domain/ITornadoAttckRenderer'
import { ITornadoAttackRendererFactory } from '../domain/ITornadoAttackRendererFactory'
import { TornadoAttackRenderer } from './tornadoAttackRenderer'

export class TornadoAttackRendererFactory implements ITornadoAttackRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(): ITornadoAttackRenderer {
    return new TornadoAttackRenderer(this.scene)
  }
}
