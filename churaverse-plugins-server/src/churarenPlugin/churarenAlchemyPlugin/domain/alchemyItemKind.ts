import { Direction, Entity, KnownKeyOf, Position } from 'churaverse-engine-server'
import { AlchemyItem } from './alchemyItem'

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export interface AlchemyItemKindMap {
  [key: string]: AlchemyItem
}

export type AlchemyItemKind = KnownKeyOf<AlchemyItemKindMap>

export abstract class BaseAlchemyItem extends Entity {
  public constructor(
    public readonly itemId: string,
    public readonly kind: AlchemyItemKind
  ) {
    super(new Position(0, 0), Direction.down)
  }
}
