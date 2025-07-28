import { Position, Direction, WeaponEntity } from 'churaverse-engine-client'
import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/alchemyItem'
import { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/IAlchemyItem'
import trapImage from '../assets/grassTrap.gif'

export const TRAP_ITEM: IAlchemyItem = {
  kind: 'trap',
  image: trapImage,
} as const

/**
 * Trapクラスの定義
 */
export class Trap extends AlchemyItem implements WeaponEntity {
  public readonly power = 50
  public trapId: string
  public readonly id: string
  public spawnTime: number
  public ownerId: string

  public constructor(trapId: string, ownerId: string, position: Position, direction: Direction, spawnTime: number) {
    super(trapId, TRAP_ITEM.kind)
    this.id = trapId
    this.trapId = trapId
    this.ownerId = ownerId
    this.position = position
    this.direction = direction
    this.spawnTime = spawnTime
  }
}
