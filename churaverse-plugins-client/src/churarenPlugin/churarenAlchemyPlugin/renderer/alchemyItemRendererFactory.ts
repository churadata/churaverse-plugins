import { Scene } from 'phaser'
import { IAlchemyItemRendererFactory } from '../domain/IAlchemyItemRendererFactory'
import { AlchemyItemRenderer } from './alchemyItemRenderer'
import { IAlchemyItemRenderer } from '../domain/IAlchemyItemRenderer'
import { AlchemyItemKind } from '../domain/alchemyItemKind'

export class AlchemyItemRendererFactory implements IAlchemyItemRendererFactory {
  public constructor(
    private readonly scene: Scene,
    private readonly kind: AlchemyItemKind,
    private readonly displaySize: number
  ) {}

  public build(): IAlchemyItemRenderer {
    return new AlchemyItemRenderer(this.scene, this.kind, this.displaySize)
  }
}
