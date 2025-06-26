import { Direction, Entity, Position, Vector, WeaponEntity } from 'churaverse-engine-server'
import { ICollidableEntity } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/ICollidableEntity'
import { IRectangle } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/IRectangle'
import { WorldMap } from '@churaverse/map-plugin-server/domain/worldMap'

export const EXPLOSION_WALK_LIMIT_GRIDS = 1
export const EXPLOSION_WALK_LIMIT_MS = 600

// TODO: CV-706マージ後にChurarenWeaponEntityをimplementsするように修正
export class Explosion extends Entity implements ICollidableEntity, WeaponEntity {
  public isCollidable = true
  public getRect(): IRectangle {
    return {
      width: this.SIDE_LENGTH,
      height: this.SIDE_LENGTH,
      position: this.position.copy(),
    }
  }

  public get id(): string {
    return this.explosionId
  }

  private _isDead = false
  public readonly explosionId: string
  // TODO: CV-706マージ後にChurarenWeaponOwnerIdを使用するように修正
  public readonly ownerId: string // 爆発を撃ったプレイヤーのid
  public readonly power = 100
  public readonly spawnTime: number
  private _velocity: Vector

  private readonly SIDE_LENGTH = 200

  public constructor(
    explosionId: string,
    ownerId: string,
    position: Position,
    direction: Direction,
    spawnTime: number
  ) {
    super(position, direction)
    this.explosionId = explosionId
    this.ownerId = ownerId
    this.spawnTime = spawnTime

    // walkするまでは停止
    this._velocity = { x: 0, y: 0 }
  }

  public walk(worldMap: WorldMap): void {
    const moveDistance = EXPLOSION_WALK_LIMIT_GRIDS * worldMap.gridSize
    const speed = moveDistance / EXPLOSION_WALK_LIMIT_MS
    this._velocity = {
      x: this.direction.x * speed,
      y: this.direction.y * speed,
    }
  }

  public set isDead(_isDead: boolean) {
    this._isDead = _isDead
  }

  /**
   * isDeadがtrueでなくともスポーン後EXPLOSION_WALK_LIMIT_MS経過している場合はfalseになる
   */
  public get isDead(): boolean {
    const now = Date.now()
    if (now - this.spawnTime >= EXPLOSION_WALK_LIMIT_MS) {
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
}
