import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/alchemyItem'
import { Direction, GRID_SIZE, Position, WeaponEntity } from 'churaverse-engine-client'
import { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/IAlchemyItem'
import explosionImage from '../assets/explosion.png'
import { AlchemyItemKind } from '@churaverse/churaren-alchemy-plugin-client/domain/alchemyItemKind'

/**
 * 表示時の縦横のサイズ
 */
const DISPLAY_SIZE = 100
export const EXPLOSION_WALK_LIMIT_GRIDS = 1
export const EXPLOSION_WALK_LIMIT_MS = 600
export const EXPLOSION_SPEED = (EXPLOSION_WALK_LIMIT_GRIDS * GRID_SIZE) / EXPLOSION_WALK_LIMIT_MS
export const explosion: AlchemyItemKind = 'explosion'
export const EXPLOSION_ITEM: IAlchemyItem = {
  image: explosionImage,
  displaySize: DISPLAY_SIZE,
} as const

/**
 * Explosionクラスの定義
 */
// TODO: CV-706マージ後に`ChurarenWeaponEntity`をimplementsする
export class Explosion extends AlchemyItem implements WeaponEntity {
  public readonly power = 100
  public isDead = false
  public explosionId: string
  public spawnTime: number
  // TODO: `ChurarenWeaponEntity`をimplementsした際に、ownerIdを`churarenWeaponOwnerId`に変更し、idは`explosionId`に統合される
  public readonly id: string
  public ownerId: string

  public constructor(
    explosionId: string,
    ownerId: string,
    position: Position,
    direction: Direction,
    spawnTime: number
  ) {
    super(explosionId, explosion)
    this.id = explosionId
    this.explosionId = explosionId
    this.ownerId = ownerId
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
