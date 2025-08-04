import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/alchemyItem'
import { AlchemyItemKind } from '@churaverse/churaren-alchemy-plugin-client/domain/alchemyItemKind'
import { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/IAlchemyItem'
import { Direction, Position } from 'churaverse-engine-client'
import tornadoImage from '../assets/tornado.png'
import { ChurarenWeaponEntity } from '@churaverse/churaren-core-plugin-client'

export const TORNADO_WALK_LIMIT_GRIDS = 5
export const TORNADO_WALK_LIMIT_MS = 500
export const tornado: AlchemyItemKind = 'tornado'
export const TORNADO_ITEM: IAlchemyItem = {
  kind: 'tornado',
  image: tornadoImage,
}

/**
 * Tornadoクラスの定義
 */
export class Tornado extends AlchemyItem implements ChurarenWeaponEntity {
  public readonly power = 70
  public isDead = false
  public tornadoId: string
  public spawnTime: number
  public churarenWeaponOwnerId: string

  public constructor(tornadoId: string, ownerId: string, position: Position, direction: Direction, spawnTime: number) {
    super(tornadoId, TORNADO_ITEM.kind)
    this.tornadoId = tornadoId
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
