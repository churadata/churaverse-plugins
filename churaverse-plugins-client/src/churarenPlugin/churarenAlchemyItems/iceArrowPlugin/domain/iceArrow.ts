import { GRID_SIZE, Position, Direction, Vector, WeaponEntity } from 'churaverse-engine-client'
import { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/IAlchemyItem'
import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/AlchemyItem'
import { AlchemyItemKind } from '@churaverse/churaren-alchemy-plugin-client/domain/AlchemyItemKind'
import iceArrowImage from '../assets/iceArrow.png'

/**
 * 表示時の縦横のサイズ
 */
const DISPLAY_SIZE = 100
export const ICE_ARROW_WALK_LIMIT_GRIDS = 25
export const ICE_ARROW_WALK_LIMIT_MS = 2400
export const ICE_ARROW_SPEED = (ICE_ARROW_WALK_LIMIT_GRIDS * GRID_SIZE) / ICE_ARROW_WALK_LIMIT_MS
export const iceArrow: AlchemyItemKind = 'iceArrow'
export const ICE_ARROW_ITEM: IAlchemyItem = {
  image: iceArrowImage,
  displaySize: DISPLAY_SIZE,
} as const

/**
 * IceArrowクラスの定義
 * @param iceArrowId 氷の矢のID
 * @param ownerId 氷の矢の所有者のID
 * @param position 氷の矢の位置
 * @param direction プレイヤーの向き
 * @param spawnTime 氷の矢の生成時間
 * @param attackVector 矢の進行方向(プレイヤーの向きに対する相対ベクトル)
 */
export class IceArrow extends AlchemyItem implements WeaponEntity {
  public readonly power = 100
  public isDead = false
  public iceArrowId: string
  public spawnTime: number
  public attackVector: Vector
  public ownerId: string
  public readonly id: string

  public constructor(
    iceArrowId: string,
    ownerId: string,
    position: Position,
    direction: Direction,
    spawnTime: number,
    attackVector: Vector
  ) {
    super(iceArrowId, 'iceArrow')
    this.iceArrowId = iceArrowId
    this.ownerId = ownerId
    this.spawnTime = spawnTime
    this.position = position
    this.direction = direction
    this.attackVector = attackVector
    this.id = iceArrowId
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
