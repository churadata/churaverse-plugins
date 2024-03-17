import { Scene } from 'phaser'
import { IBombRenderer } from '../domain/IBombRenderer'
import { IBombRendererFactory } from '../domain/IBombRendererFactory'
import { BombRenderer } from './bombRenderer'

export class BombRendererFactory implements IBombRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(): IBombRenderer {
    return new BombRenderer(this.scene)
  }
}
