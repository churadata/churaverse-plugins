import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/alchemyItem'
import { AlchemyItemKind } from '@churaverse/churaren-alchemy-plugin-client/domain/alchemyItemKind'
import { IAlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/IAlchemyItem'
import { Direction, Position } from 'churaverse-engine-client'
import healingPotionImage from '../assets/healingPotion.png'

const DISPLAY_SIZE = 80
export const healignPotion: AlchemyItemKind = 'healingPotion'
export const HEALING_POTION_ITEM: IAlchemyItem = {
  image: healingPotionImage,
  displaySize: DISPLAY_SIZE,
}

/**
 * 回復アイテムの定義
 */
export class HealingPotion extends AlchemyItem {
  public readonly heal = 50
  public isDead = false
  public healingPotionId: string
  public ownerId: string
  public spawnTime: number

  public constructor(
    healingPotionId: string,
    ownerId: string,
    position: Position,
    direction: Direction,
    spawnTime: number
  ) {
    super(healingPotionId, healignPotion)
    this.healingPotionId = healingPotionId
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
