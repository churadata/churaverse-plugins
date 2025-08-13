import { Position, Direction, Entity, WeaponEntity } from 'churaverse-engine-server'
import { ICollidableEntity } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/ICollidableEntity'
import { IRectangle } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/IRectangle'

const WATER_RING_SPAWN_LIMIT_MS = 5000

export class WaterRing extends Entity implements ICollidableEntity, WeaponEntity {
  public isCollidable = true
  public getRect(): IRectangle {
    return {
      width: this._width,
      height: this._height,
      position: this.position.copy(),
    }
  }

  public get id(): string {
    return this.waterRingId
  }

  private _isDead = false
  public readonly waterRingId: string
  public readonly ownerId: string
  public readonly power = 25
  public readonly spawnTime: number
  public lastHitTime: number = 0 // 最後にヒットした時間
  private readonly hitCooldown: number = 1000 // クールダウンの時間（ミリ秒）

  private readonly SIDE_LENGTH = 200
  private readonly _width: number = this.SIDE_LENGTH
  private readonly _height: number = this.SIDE_LENGTH

  public constructor(
    waterRingId: string,
    ownerId: string,
    position: Position,
    direction: Direction,
    spawnTime: number
  ) {
    super(position, direction)
    this.waterRingId = waterRingId
    this.ownerId = ownerId
    this.spawnTime = spawnTime
    this.lastHitTime = 0
    // 10秒後にisDeadをtrueにするタイマーを設定
    setTimeout(() => {
      this._isDead = true
    }, WATER_RING_SPAWN_LIMIT_MS)
  }

  public isStop(): void {
    this.isCollidable = false

    // 1秒後に再び有効にする
    setTimeout(() => {
      this.isCollidable = true
    }, this.hitCooldown)
  }

  public get isDead(): boolean {
    const now = Date.now()
    if (now - this.spawnTime >= WATER_RING_SPAWN_LIMIT_MS) {
      this._isDead = true
    }
    return this._isDead
  }

  public die(): void {
    this._isDead = true
    this.isCollidable = false
  }
}
