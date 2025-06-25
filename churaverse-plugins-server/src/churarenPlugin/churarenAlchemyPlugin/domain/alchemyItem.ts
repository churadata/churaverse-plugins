import { Direction, Entity, Position } from 'churaverse-engine-server'
import { AlchemyItemKind } from './alchemyItemKind'

export class AlchemyItem extends Entity {
  public itemId: string
  public spawnTime: number
  public kind: AlchemyItemKind

  public constructor(itemId: string, position: Position, spawnTime: number, kind: AlchemyItemKind) {
    super(position, Direction.down)
    this.itemId = itemId
    this.spawnTime = spawnTime
    this.kind = kind
  }
}
