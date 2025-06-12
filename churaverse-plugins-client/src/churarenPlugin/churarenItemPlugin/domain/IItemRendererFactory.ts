import { IItemRenderer } from './IItemRenderer'
import { ItemKind } from './itemKind'

export interface IItemRendererFactory {
  build: (kind: ItemKind) => IItemRenderer
}
