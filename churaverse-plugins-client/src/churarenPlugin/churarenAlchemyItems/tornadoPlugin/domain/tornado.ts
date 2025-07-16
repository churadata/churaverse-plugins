import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/alchemyItem'
import { AlchemyItemKind } from '@churaverse/churaren-alchemy-plugin-client/domain/alchemyItemKind'
import { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/IAlchemyItem'
import { Direction, Position, WeaponEntity } from 'churaverse-engine-client'
import tornadoImage from '../assets/tornado.png'

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
// TODO: CV-706マージ後に`ChurarenWeaponEntity`をimplementsする
export class Tornado extends AlchemyItem implements WeaponEntity {
  public readonly power = 70
  public isDead = false
  public tornadoId: string
  public spawnTime: number
  // TODO: `ChurarenWeaponEntity`をimplementsした際に、ownerIdを`churarenWeaponOwnerId`に変更し、idは`tornadoId`に統合される
  public readonly id: string
  public ownerId: string

  public constructor(tornadoId: string, ownerId: string, position: Position, direction: Direction, spawnTime: number) {
    super(tornadoId, TORNADO_ITEM.kind)
    this.id = tornadoId
    this.tornadoId = tornadoId
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
