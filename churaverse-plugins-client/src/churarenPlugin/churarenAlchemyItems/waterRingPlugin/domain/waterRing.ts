import { Position, Direction, WeaponEntity } from 'churaverse-engine-client'
import { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/IAlchemyItem'
import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/alchemyItem'
import { AlchemyItemKind } from '@churaverse/churaren-alchemy-plugin-client/domain/alchemyItemKind'
import waterRingImage from '../assets/waterRing.gif'

export const waterRing: AlchemyItemKind = 'waterRing'
export const WATER_RING_ITEM: IAlchemyItem = {
  displaySize: 100,
  image: waterRingImage,
} as const

/**
 * waterRingクラスの定義
 */
export class WaterRing extends AlchemyItem implements WeaponEntity {
  public readonly power = 25
  public waterRingId: string
  public churarenWeaponOwnerId: string
  public spawnTime: number
  public readonly id: string = 'waterRing'
  public ownerId: string

  public constructor(
    waterRingId: string,
    ownerId: string,
    position: Position,
    direction: Direction,
    spawnTime: number
  ) {
    super(waterRingId, 'waterRing')
    this.waterRingId = waterRingId
    this.churarenWeaponOwnerId = ownerId
    this.ownerId = ownerId
    this.position = position
    this.spawnTime = spawnTime
    this.direction = direction
  }
}
