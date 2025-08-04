import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/alchemyItem'
import { Direction, GRID_SIZE, Position } from 'churaverse-engine-client'
import { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/IAlchemyItem'
import explosionImage from '../assets/explosion.png'
import { ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-client'

/**
 * 表示時の縦横のサイズ
 */
export const EXPLOSION_WALK_LIMIT_GRIDS = 1
export const EXPLOSION_WALK_LIMIT_MS = 600
export const EXPLOSION_SPEED = (EXPLOSION_WALK_LIMIT_GRIDS * GRID_SIZE) / EXPLOSION_WALK_LIMIT_MS
export const EXPLOSION_ITEM: IAlchemyItem = {
  kind: 'explosion',
  image: explosionImage,
} as const

/**
 * Explosionクラスの定義
 */
export class Explosion extends AlchemyItem implements ChurarenWeaponEntity {
  public readonly power = 100
  public isDead = false
  public explosionId: string
  public spawnTime: number
  public churarenWeaponOwnerId: string

  public constructor(
    explosionId: string,
    ownerId: string,
    position: Position,
    direction: Direction,
    spawnTime: number
  ) {
    super(explosionId, EXPLOSION_ITEM.kind)
    this.explosionId = explosionId
    this.churarenWeaponOwnerId = ownerId
    this.position = position
    this.spawnTime = spawnTime
    this.direction = direction
  }

  /**
   * 移動
   * @param position 宛先
   */
  public walk(position: Position): void {
    this.position.x = position.x
    this.position.y = position.y
  }

  /**
   * 消滅
   */
  public die(): void {
    this.isDead = true
  }
}
