import { ItemKind } from './itemKind'
import { ICollidableEntity } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/ICollidableEntity'
import { IRectangle } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/IRectangle'
import { Direction, Entity, Position } from 'churaverse-engine-server'

export class Item extends Entity implements ICollidableEntity {
  public isCollidable = true
  public readonly itemId: string
  public readonly spawnTime: number
  public readonly timeLimit = 10000 // 設置してからアイテムが消えるまでの時間(ms)
  public readonly kind: ItemKind // アイテムの種類

  public get id(): string {
    return this.itemId
  }

  public getRect(): IRectangle {
    return {
      width: 50,
      height: 50,
      position: this.position.copy(),
    }
  }

  public constructor(itemId: string, position: Position, spawnTime: number, kind: ItemKind) {
    super(position, Direction.down)
    this.itemId = itemId
    this.spawnTime = spawnTime
    this.kind = kind
  }

  /**
   * 設置してからの時間がtimeLimitを超えていた場合true
   */
  public get isDespawn(): boolean {
    return Date.now() - this.spawnTime >= this.timeLimit
  }
}
