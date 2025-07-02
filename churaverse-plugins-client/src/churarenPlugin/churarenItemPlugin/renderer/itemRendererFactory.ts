import { Scene } from 'phaser'
import { IItemRenderer } from '../domain/IItemRenderer'
import { IItemRendererFactory } from '../domain/IItemRendererFactory'
import { ItemRenderer } from './itemRenderer'
import { ItemKind } from '../domain/itemKind'

export class ItemRendererFactory implements IItemRendererFactory {
  public constructor(private readonly scene: Scene) {}

  public build(kind: ItemKind): IItemRenderer {
    return new ItemRenderer(this.scene, kind)
  }
}
