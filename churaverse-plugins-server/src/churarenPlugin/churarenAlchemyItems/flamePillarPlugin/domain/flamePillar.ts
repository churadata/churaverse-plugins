import { Direction, Entity, Position, WeaponEntity } from 'churaverse-engine-server'
import { ICollidableEntity } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/ICollidableEntity'
import { IRectangle } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/IRectangle'

export const FLAME_PILLAR_SPAWN_LIMIT_MS = 10000

export class FlamePillar extends Entity implements ICollidableEntity, WeaponEntity {
  public isCollidable = true
  private _isDead = false
  public readonly flamePillarId: string

  // CV-706マージ後にChurarenWeaponOwnerIDを使用するように修正する。
  public readonly ownerId: string
  public readonly power = 50
  public readonly spawnTime: number

  private readonly SIDE_LENGTH = 70

  public constructor(
    flamePillarId: string,
    ownerId: string,
    position: Position,
    direction: Direction,
    spawnTime: number
  ) {
    super(position, direction)
    this.flamePillarId = flamePillarId
    this.ownerId = ownerId
    this.spawnTime = spawnTime

    // 10秒後にisDeadをtrueにする
    setTimeout(() => {
      this._isDead = true
    }, FLAME_PILLAR_SPAWN_LIMIT_MS)
  }

  public get id(): string {
    return this.flamePillarId
  }

  public get isDead(): boolean {
    const now = Date.now()
    if (now - this.spawnTime >= FLAME_PILLAR_SPAWN_LIMIT_MS) {
      this._isDead = true
    }
    return this._isDead
  }

  public getRect(): IRectangle {
    return {
      width: this.SIDE_LENGTH,
      height: this.SIDE_LENGTH,
      position: this.position.copy(),
    }
  }

  public isStop(): void {
    this.isCollidable = false

    if (!this.isCollidable) {
      // 1秒後に再び有効にする
      setTimeout(() => {
        this.isCollidable = true
      }, 1000)
    }
  }
}
