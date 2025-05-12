import { Scene } from 'phaser'
import { IBossRenderer } from '../domain/IBossRenderer'
import { IBossRendererFactory } from '../domain/IBossRendererFactory'
import { BossRenderer } from './bossRenderer'
import { Position } from 'churaverse-engine-client'

export class BossRendererFactory implements IBossRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(position: Position, bossHP: number): IBossRenderer {
    return new BossRenderer(this.scene, position, bossHP)
  }
}
