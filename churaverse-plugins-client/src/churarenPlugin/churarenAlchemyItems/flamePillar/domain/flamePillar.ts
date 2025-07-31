import { Position, Direction, WeaponEntity } from 'churaverse-engine-client'
import { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/IAlchemyItem'
import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/alchemyItem'
import { AlchemyItemKind } from '@churaverse/churaren-alchemy-plugin-client/domain/alchemyItemKind'
import flamePillarImage from '../assets/flamePillarAttack.png'

export const flamePillar: AlchemyItemKind = 'flamePillar'
export const FLAME_PILLAR_ITEM: IAlchemyItem = {
  kind: 'flamePillar',
  image: flamePillarImage,
} as const

/**
 * FlamePillarクラスの定義
 */
export class FlamePillar extends AlchemyItem implements WeaponEntity {
  public readonly power = 50
  public flamePillarId: string
  public ownerId: string
  public spawnTime: number
  public readonly id

  public constructor(
    flamePillarId: string,
    ownerId: string,
    position: Position,
    direction: Direction,
    spawnTime: number
  ) {
    super(flamePillarId, 'flamePillar')
    this.flamePillarId = flamePillarId
    this.ownerId = ownerId
    this.spawnTime = spawnTime
    this.id = flamePillarId
  }
}
