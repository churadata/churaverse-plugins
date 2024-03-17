import { ISharkRenderer } from '../domain/ISharkRenderer'
import { ISharkRendererFactory } from '../domain/ISharkRendererFactory'
import { Scene } from 'phaser'
import { SharkRenderer } from './sharkRenderer'

export class SharkRendererFactory implements ISharkRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(): ISharkRenderer {
    return new SharkRenderer(this.scene)
  }
}
