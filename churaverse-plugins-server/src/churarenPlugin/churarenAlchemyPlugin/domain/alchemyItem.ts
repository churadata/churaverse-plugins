import { Direction, Entity, Position } from 'churaverse-engine-server'
import { AlchemyItemKind } from './alchemyItemKind'

export class AlchemyItem extends Entity {
  public readonly itemId: string
  public readonly kind: AlchemyItemKind

  public constructor(itemId: string, kind: AlchemyItemKind) {
    super(new Position(0, 0), Direction.down)
    this.itemId = itemId
    this.kind = kind
  }
}
