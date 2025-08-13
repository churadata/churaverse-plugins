import { Position, Direction } from 'churaverse-engine-client'
import { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/IAlchemyItem'
import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/alchemyItem'
import { AlchemyItemKind } from '@churaverse/churaren-alchemy-plugin-client/domain/alchemyItemKind'
import waterRingImage from '../assets/waterRing.gif'
import { ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-client'

export const waterRing: AlchemyItemKind = 'waterRing'
export const WATER_RING_ITEM: IAlchemyItem = {
  kind: 'waterRing',
  image: waterRingImage,
} as const

/**
 * waterRingクラスの定義
 */
export class WaterRing extends AlchemyItem implements ChurarenWeaponEntity {
  public readonly power = 25
  public waterRingId: string
  public churarenWeaponOwnerId: string
  public spawnTime: number

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
    this.position = position
    this.spawnTime = spawnTime
    this.direction = direction
  }
}
