import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/alchemyItem'
import { Direction, GRID_SIZE, Position, WeaponEntity } from 'churaverse-engine-client'
import { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/IAlchemyItem'
import blackHoelImage from '../assets/blackHole.png'

export const BLACK_HOLE_MOVE_LIMIT_GRIDS = 20
export const BLACK_HOLE_MOVE_LIMIT_MS = 1500
export const BLACK_HOLE_SPEED = (BLACK_HOLE_MOVE_LIMIT_GRIDS * GRID_SIZE) / BLACK_HOLE_MOVE_LIMIT_MS
export const BLACK_HOLE_ITEM: IAlchemyItem = {
  kind: 'blackHole',
  image: blackHoelImage,
} as const

/**
 * blackHoleクラスの定義
 */
// TODO: CV-706マージ後に`ChurarenWeaponEntity`をimplementsする
export class BlackHole extends AlchemyItem implements WeaponEntity {
  public readonly power = 20
  public isDead = false
  public blackHoleId: string
  public spawnTime: number
  // TODO: `ChurarenWeaponEntity`をimplementsした際に、ownerIdを`churarenWeaponOwnerId`に変更し、idは`blackHoleId`に統合される
  public readonly id: string
  public ownerId: string

  public constructor(
    blackHoleId: string,
    ownerId: string,
    position: Position,
    direction: Direction,
    spawnTime: number
  ) {
    super(blackHoleId, BLACK_HOLE_ITEM.kind)
    this.id = blackHoleId
    this.blackHoleId = blackHoleId
    this.ownerId = ownerId
    this.spawnTime = spawnTime
    this.direction = direction
  }
}
