import { Position, Direction, Entity, WeaponEntity } from 'churaverse-engine-server'
import { ICollidableEntity } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/ICollidableEntity'
import { IRectangle } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/IRectangle'

export class Trap extends Entity implements ICollidableEntity, WeaponEntity {
  public isCollidable = true
  public getRect(): IRectangle {
    return {
      width: this._width,
      height: this._height,
      position: this.position.copy(),
    }
  }

  public get id(): string {
    return this.trapId
  }

  public readonly trapId: string
  public readonly ownerId: string // トラップを持っているプレイヤーのid
  public readonly power = 50
  public readonly spawnTime: number

  private readonly SIDE_LENGTH = 70
  private readonly _width: number = this.SIDE_LENGTH
  private readonly _height: number = this.SIDE_LENGTH

  public constructor(trapId: string, ownerId: string, position: Position, direction: Direction, spawnTime: number) {
    super(position, direction)
    this.trapId = trapId
    this.ownerId = ownerId
    this.spawnTime = spawnTime
  }
}
