import { IFlareRenderer } from '../domain/IFlareRenderer'
import { IFlareRendererFactory } from '../domain/IFlareRendererFactory'
import { Scene } from 'phaser'
import { FlareRenderer } from './flareRenderer'

export class FlareRendererFactory implements IFlareRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(): IFlareRenderer {
    return new FlareRenderer(this.scene)
  }
}
