import { ICollidableEntity } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/ICollidableEntity'
import { IRectangle } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/IRectangle'
import { Position, Direction, Vector, Entity, WeaponEntity } from 'churaverse-engine-server'
import { WorldMap } from '@churaverse/map-plugin-server/domain/worldMap'

export const FLARE_SPREAD_LIMIT_GRIDS = 6
export const FLARE_SPREAD_LIMIT_MS = 2400
export const FLARE_PROPAGATE_DELAY_MS = 300  // 炎が発生してから拡散するまでの遅延時間


export class Flare extends Entity implements ICollidableEntity, WeaponEntity {
  public isCollidable = true
  public getRect(): IRectangle {
    return {
      width: 80,
      height: 80,
      position: this.position.copy(),
    }
  }

  public get id(): string {
    return this.flareId
  }

  private _isDead = false
  public readonly flareId: string
  public readonly ownerId: string // 炎を撃ったプレイヤーのid
  public readonly power = 50
  public readonly spawnTime: number
  private _velocity: Vector

  public constructor (flareId: string, ownerId: string, position: Position, direction: Direction, spawnTime: number) {
    super(position, direction)
    this.flareId = flareId
    this.ownerId = ownerId
    this.spawnTime = spawnTime

    // spreadするまでは停止
    this._velocity = { x: 0, y: 0 }
    }

  public spread(worldMap: WorldMap): void {
    const moveDistance = FLARE_SPREAD_LIMIT_GRIDS * worldMap.gridSize
    const speed = moveDistance / FLARE_SPREAD_LIMIT_MS
    this._velocity = {
      x: this.direction.x * speed,
      y: this.direction.y * speed,
    }
  }

  public set isDead(_isDead: boolean) {
    this._isDead = _isDead
  }

  /**
   * isDeadがtrueでなくともスポーン FLARE_WALK_LIMIT_MS経過している場合はfalseになる
   */
  public get isDead(): boolean {
    const now = Date.now()
    if (now - this.spawnTime >= FLARE_SPREAD_LIMIT_MS) {
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
