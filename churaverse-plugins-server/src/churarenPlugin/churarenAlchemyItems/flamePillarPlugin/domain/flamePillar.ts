import { Direction, Position } from 'churaverse-engine-server'
import { ICollidableEntity } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/ICollidableEntity'
import { IRectangle } from '@churaverse/collision-detection-plugin-server/domain/collisionDetection/collidableEntity/IRectangle'
import { ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-server'
import { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-server/domain/IAlchemyItem'
import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-server/domain/alchemyItem'

export const FLAME_PILLAR_SPAWN_LIMIT_MS = 10000
export const FLAME_PILLAR_ITEM: IAlchemyItem = {
  kind: 'flamePillar',
  recipe: {
    pattern: 'all_same',
    materialKind: 'fireOre',
  },
}

export class FlamePillar extends AlchemyItem implements ICollidableEntity, ChurarenWeaponEntity {
  public isCollidable = true
  public getRect(): IRectangle {
    return {
      width: this.FLAME_PILLAR_SIZE,
      height: this.FLAME_PILLAR_SIZE,
      position: this.position.copy(),
    }
  }

  public get id(): string {
    return this.flamePillarId
  }

  private _isDead = false
  public readonly flamePillarId: string
  public readonly churarenWeaponOwnerId: string
  public readonly power = 50
  public readonly spawnTime: number

  private readonly FLAME_PILLAR_SIZE = 70

  public constructor(
    flamePillarId: string,
    ownerId: string,
    position: Position,
    direction: Direction,
    spawnTime: number
  ) {
    super(flamePillarId, 'flamePillar')
    this.flamePillarId = flamePillarId
    this.churarenWeaponOwnerId = ownerId
    this.spawnTime = spawnTime
    this.position = position
    this.direction = direction

    // 10秒後にisDeadをtrueにする
    setTimeout(() => {
      this._isDead = true
    }, FLAME_PILLAR_SPAWN_LIMIT_MS)
  }

  public get isDead(): boolean {
    const now = Date.now()
    if (now - this.spawnTime >= FLAME_PILLAR_SPAWN_LIMIT_MS) {
      this._isDead = true
    }
    return this._isDead
  }

  public die(): void {
    this._isDead = true
    this.isCollidable = false
  }
}

declare module '@churaverse/churaren-alchemy-plugin-server/domain/alchemyItemKind' {
  export interface AlchemyItemKindMap {
    flamePillar: FlamePillar
  }
}
