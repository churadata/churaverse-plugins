import { Direction, Entity, Position, Vector, vectorToName } from 'churaverse-engine-server'
import { ICollidableEntity } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/ICollidableEntity'
import { IRectangle } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/IRectangle'
import { ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-server'

const BLACK_HOLE_DISABLE_COLLISION_LIMIT_MS = 1000
const BLACK_HOLE_SPAWN_LIMIT_MS = 10000
const BLACK_HOLE_WALK_LIMIT_GRIDS = 20
const BLACK_HOLE_WALK_LIMIT_MS = 1500
const BLACK_HOLE_WALK_SPEED = BLACK_HOLE_WALK_LIMIT_GRIDS / BLACK_HOLE_WALK_LIMIT_MS

/**
 * blackHoleクラスの定義
 */
export class BlackHole extends Entity implements ICollidableEntity, ChurarenWeaponEntity {
  public isCollidable = true
  public getRect(): IRectangle {
    return {
      width: this.BLACKHOLE_SIZE,
      height: this.BLACKHOLE_SIZE,
      position: this.position.copy(),
    }
  }

  public get id(): string {
    return this.blackHoleId
  }

  public _isDead = false
  public readonly power = 20
  public readonly blackHoleId: string
  public readonly churarenWeaponOwnerId: string
  public readonly spawnTime: number
  private readonly _velocity: Vector
  private moveDirection: Direction = Direction.right
  private readonly _startPosition: Position
  private readonly _reversePosition: Position

  private readonly BLACKHOLE_SIZE = 140

  public constructor(
    blackHoleId: string,
    ownerId: string,
    position: Position,
    direction: Direction,
    spawnTime: number
  ) {
    super(position, direction)
    this.blackHoleId = blackHoleId
    this.churarenWeaponOwnerId = ownerId
    this.spawnTime = spawnTime
    this._startPosition = this.position.copy()
    if (vectorToName(this.direction) === 'left' || vectorToName(this.direction) === 'up') {
      this._reversePosition = new Position(this.position.x - BLACK_HOLE_WALK_LIMIT_GRIDS, this.position.y)
    } else {
      this._reversePosition = new Position(this.position.x + BLACK_HOLE_WALK_LIMIT_GRIDS, this.position.y)
    }

    this._velocity = { x: 0, y: 0 }
    // 10秒後にisDeadをtrueにするタイマーを設定
    setTimeout(() => {
      this._isDead = true
    }, BLACK_HOLE_SPAWN_LIMIT_MS)
  }

  public disableCollisionTemporarily(): void {
    this.isCollidable = false

    // 1秒後に再び有効にする
    setTimeout(() => {
      this.isCollidable = true
    }, BLACK_HOLE_DISABLE_COLLISION_LIMIT_MS)
  }

  public set isDead(value: boolean) {
    this._isDead = value
  }

  public get isDead(): boolean {
    const now = Date.now()
    if (now - this.spawnTime >= BLACK_HOLE_SPAWN_LIMIT_MS) {
      this._isDead = true
    }
    return this._isDead
  }

  public die(): void {
    this._isDead = true
    this.isCollidable = false
  }

  public move(dt: number): void {
    this.position.x += this._velocity.x * dt
    this.position.y += this._velocity.y * dt
  }

  public walk(): void {
    if (vectorToName(this.direction) === 'left' || vectorToName(this.direction) === 'up') {
      this.moveDirection = Direction.left
    } else {
      this.moveDirection = Direction.right
    }
    this._velocity.x = BLACK_HOLE_WALK_SPEED * this.moveDirection.x
  }

  public reverseVelocityX(): void {
    this._velocity.x *= -1
  }

  public get startPosition(): Position {
    return this._startPosition
  }

  public get reversePosition(): Position {
    return this._reversePosition
  }
}
