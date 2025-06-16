import { ICollidableEntity } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/ICollidableEntity'
import { IRectangle } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/IRectangle'
import { Direction, Entity, Position } from 'churaverse-engine-server'

export class AlchemyPot extends Entity implements ICollidableEntity {
  public isCollidable = true
  public readonly potId: string

  public get id(): string {
    return this.potId
  }

  public getRect(): IRectangle {
    return {
      width: 64,
      height: 64,
      position: this.position.copy(),
    }
  }

  public constructor(potId: string, position: Position) {
    super(position, Direction.down)
    this.potId = potId
  }

  public contact(): void {
    this.isCollidable = true
  }
}
