import { Direction, Entity, Position, Vector } from 'churaverse-engine-server'
import { ICollidableEntity } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/ICollidableEntity'
import { IRectangle } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/IRectangle'
import { WorldMap } from '@churaverse/map-plugin-server/domain/worldMap'
import { ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-server'
import { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-server/domain/IAlchemyItem'

export const TORNADO_WALK_LIMIT_GRIDS = 5
export const TORNADO_WALK_LIMIT_MS = 500
const totalSteps = 10
export const TORNADO_ITEM: IAlchemyItem = {
  kind: 'tornado',
  recipe: {
    pattern: 'two_same_one_diff',
    materialKind: 'grassOre',
  },
}

export class Tornado extends Entity implements ICollidableEntity, ChurarenWeaponEntity {
  public isCollidable = true
  public getRect(): IRectangle {
    return {
      width: 200,
      height: 200,
      position: this.position.copy(),
    }
  }

  public get id(): string {
    return this.tornadoId
  }

  public get churarenWeaponId(): string {
    return this.tornadoId
  }

  private _isDead = false
  public readonly tornadoId: string
  public readonly churarenWeaponOwnerId: string
  public readonly power = 70
  public readonly spawnTime: number
  private _velocity: Vector
  public stepIndex = 0

  public constructor(tornadoId: string, ownerId: string, position: Position, direction: Direction, spawnTime: number) {
    super(position, direction)
    this.tornadoId = tornadoId
    this.churarenWeaponOwnerId = ownerId
    this.spawnTime = spawnTime

    // walkするまでは停止
    this._velocity = { x: 0, y: 0 }
  }

  public walk(worldMap: WorldMap): void {
    const speed = (TORNADO_WALK_LIMIT_GRIDS * worldMap.gridSize) / TORNADO_WALK_LIMIT_MS
    this._velocity = { x: speed, y: speed }
  }

  public set isDead(_isDead: boolean) {
    this._isDead = _isDead
  }

  /**
   * isDeadがtrueでなくともスポーン後一定時間経過している場合はfalseになる
   */
  public get isDead(): boolean {
    const now = Date.now()
    if (now - this.spawnTime > TORNADO_WALK_LIMIT_MS * (totalSteps + 1)) {
      this._isDead = true
    }
    return this._isDead
  }

  public die(): void {
    this._isDead = true
    this.isCollidable = false
  }

  public move(dt: number): void {
    // 経過時間に基づいて stepIndex を更新
    this.stepIndex = Math.floor((Date.now() - this.spawnTime) / TORNADO_WALK_LIMIT_MS)

    // 終了判定
    if (this.stepIndex > totalSteps) {
      this.isDead = true
      this.stepIndex = 0
      return
    }

    // nステップ目の竜巻の移動方向(stepIndexが偶数の時と奇数の時で切り替え)
    const moveDirection = this.stepIndex % 2 === 0 ? 1 : -1

    // 1ステップ目は移動距離が半分(ジグザグの真ん中から開始するため)
    if (this.stepIndex === 0) {
      this.position.x += (this._velocity.x * dt * moveDirection) / 2
      this.position.y += (this._velocity.y * dt * moveDirection) / 2
    } else {
      this.position.x += this._velocity.x * dt * moveDirection
      this.position.y += this._velocity.y * dt * moveDirection
    }
  }
}

declare module '@churaverse/churaren-alchemy-plugin-server/domain/alchemyItemKind' {
  export interface AlchemyItemKindMap {
    tornado: Tornado
  }
}
