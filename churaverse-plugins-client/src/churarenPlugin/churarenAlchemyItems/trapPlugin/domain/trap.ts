import { Position, Direction } from 'churaverse-engine-client'
import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/alchemyItem'
import { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/IAlchemyItem'
import trapImage from '../assets/grassTrap.gif'
import { ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-client'

export const TRAP_ITEM: IAlchemyItem = {
  kind: 'trap',
  image: trapImage,
} as const

/**
 * Trapクラスの定義
 */
export class Trap extends AlchemyItem implements ChurarenWeaponEntity {
  public readonly power = 50
  public trapId: string
  public spawnTime: number
  public churarenWeaponOwnerId: string

  public constructor(trapId: string, ownerId: string, position: Position, direction: Direction, spawnTime: number) {
    super(trapId, TRAP_ITEM.kind)
    this.trapId = trapId
    this.churarenWeaponOwnerId = ownerId
    this.position = position
    this.direction = direction
    this.spawnTime = spawnTime
  }
}
