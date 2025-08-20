import { Position, Direction, Entity } from 'churaverse-engine-server'
import { ICollidableEntity } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/ICollidableEntity'
import { IRectangle } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/IRectangle'
import { ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-server'

export class Trap extends Entity implements ICollidableEntity, ChurarenWeaponEntity {
  public isCollidable = true
  public getRect(): IRectangle {
    return {
      width: this.SIDE_LENGTH,
      height: this.SIDE_LENGTH,
      position: this.position.copy(),
    }
  }

  public get id(): string {
    return this.trapId
  }

  public readonly trapId: string
  public readonly churarenWeaponOwnerId: string // トラップを持っているプレイヤーのid
  public readonly power = 50
  public readonly spawnTime: number

  private readonly SIDE_LENGTH = 70

  public constructor(trapId: string, ownerId: string, position: Position, direction: Direction, spawnTime: number) {
    super(position, direction)
    this.trapId = trapId
    this.churarenWeaponOwnerId = ownerId
    this.spawnTime = spawnTime
  }
}
