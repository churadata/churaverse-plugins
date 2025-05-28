import { ICollidableEntity } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/ICollidableEntity'
import { IRectangle } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/IRectangle'
import { Position, Direction, Vector, Entity, WeaponEntity } from 'churaverse-engine-server'
import { WorldMap } from '@churaverse/map-plugin-server/domain/worldMap'

export const FLARE_WALK_LIMIT_GRIDS = 6
export const FLARE_WALK_LIMIT_MS = 2400
export const FLARE_PROPAGATE_DELAY_MS = 300  // 炎が発生してから拡散するまでの遅延時間


export class Flare extends Entity implements ICollidableEntity, WeaponEntity {
  public isCollidable = true
  public getRect(): IRectangle {
    return {
      width: this._width,
      height: this._height,
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

  private readonly LONG_SIDE = 90
  private readonly SHORT_SIDE = 30
  private readonly _width: number
  private readonly _height: number

  public constructor (flareId: string, ownerId: string, position: Position, direction: Direction, spawnTime: number) {
    super(position, direction)
    this.flareId = flareId
    this.ownerId = ownerId
    this.spawnTime = spawnTime

    // 炎は長方形のため向きによって幅・高さが入れ替わる
    this._width = this.direction.x === 0 ? this.SHORT_SIDE : this.LONG_SIDE
    this._height = this.direction.x === 0 ? this.LONG_SIDE : this.SHORT_SIDE


    // walkするまでは停止
    this._velocity = { x: 0, y: 0 }

        // 遅延後に当たり判定を有効化
        setTimeout(() => {
          if (!this._isDead) {
            this.isCollidable = true
          }
        }, FLARE_PROPAGATE_DELAY_MS)
    }

  public walk(worldMap: WorldMap): void {
    const moveDistance = FLARE_WALK_LIMIT_GRIDS * worldMap.gridSize
    const speed = moveDistance / FLARE_WALK_LIMIT_MS
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
    if (now - this.spawnTime >= FLARE_WALK_LIMIT_MS) {
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
