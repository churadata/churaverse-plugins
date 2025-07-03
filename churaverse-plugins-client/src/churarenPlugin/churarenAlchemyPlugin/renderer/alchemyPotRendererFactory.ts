import { Scene } from 'phaser'
import { IAlchemyPotRendererFactory } from '../domain/IAlchemyPotRendererFactory'
import { IAlchemyPotRenderer } from '../domain/IAlchemyPotRenderer'
import { AlchemyPotRenderer } from './alchemyPotRenderer'

export class AlchemyPotRendererFactory implements IAlchemyPotRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(): IAlchemyPotRenderer {
    return new AlchemyPotRenderer(this.scene)
  }
}
