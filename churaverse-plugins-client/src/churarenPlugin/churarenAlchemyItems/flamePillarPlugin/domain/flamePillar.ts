import { Position, Direction } from 'churaverse-engine-client'
import { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/IAlchemyItem'
import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/alchemyItem'
import { AlchemyItemKind } from '@churaverse/churaren-alchemy-plugin-client/domain/alchemyItemKind'
import flamePillarImage from '../assets/flamePillarAttack.png'
import { ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-client'

export const flamePillar: AlchemyItemKind = 'flamePillar'
export const FLAME_PILLAR_ITEM: IAlchemyItem = {
  kind: 'flamePillar',
  image: flamePillarImage,
} as const

/**
 * FlamePillarクラスの定義
 */
export class FlamePillar extends AlchemyItem implements ChurarenWeaponEntity {
  public readonly power = 50
  public flamePillarId: string
  public churarenWeaponOwnerId: string
  public spawnTime: number

  public constructor(
    flamePillarId: string,
    ownerId: string,
    position: Position,
    direction: Direction,
    spawnTime: number
  ) {
    super(flamePillarId, FLAME_PILLAR_ITEM.kind)
    this.flamePillarId = flamePillarId
    this.churarenWeaponOwnerId = ownerId
    this.spawnTime = spawnTime
    this.position = position
    this.direction = direction
  }
}
