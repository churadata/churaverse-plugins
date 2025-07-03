import { AlchemyPotMap, AlchemyPotInfo } from '../message/alchemyPotSpawnMessage'
import { AlchemyItem } from './alchemyItem'
import { AlchemyPot } from './alchemyPot'
import { uniqueId } from '@churaverse/churaren-core-plugin-server'
import { IAlchemyPotRepository } from './IAlchemyPotRepository'
import { Item } from '@churaverse/churaren-item-plugin-server/domain/item'
import { IPlayerMaterialItemRepository } from '@churaverse/churaren-player-plugin-server/interface/IPlayerMaterialItemRepository'
import { WorldMap } from '@churaverse/map-plugin-server/domain/worldMap'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { Player } from '@churaverse/player-plugin-server/domain/player'
import { Position, Vector } from 'churaverse-engine-server'
import { AlchemyItemKind } from './alchemyItemKind'

/**
 *  alchemyPotsの生成をfrontendに通知する
 */
export function spawnAlchemyPot(
  alchemyPot: IAlchemyPotRepository,
  worldMap: WorldMap,
  sendSpawnPot: (potMap: AlchemyPotMap) => void
): void {
  const potsMap: AlchemyPotMap = {}
  const alchemyPotPosition = calculatePositions(worldMap.width, worldMap.height)

  for (const pos of alchemyPotPosition) {
    const pot = new AlchemyPot(uniqueId(), new Position(pos.x, pos.y))
    potsMap[pot.id] = alchemyPotInfoToSendableObject(pot)
    alchemyPot.set(pot.id, pot)
  }
  sendSpawnPot(potsMap)
}

function alchemyPotInfoToSendableObject(pot: AlchemyPot): AlchemyPotInfo {
  const info: AlchemyPotInfo = {
    potId: pot.id,
    spawnPos: pot.position.toVector() as Vector & SendableObject,
  }
  return info
}

function calculatePositions(width: number, height: number): Vector[] {
  const centerX = width / 2
  const centerY = height / 2
  const offsetX = width / 20
  const offsetY = height / 20

  return [
    { x: centerX, y: offsetY }, // 上
    { x: centerX, y: height - offsetY }, // 下
    { x: offsetX, y: centerY }, // 左
    { x: width - offsetX, y: centerY }, // 右
    { x: centerX, y: centerY }, // 中央
  ]
}

/**
 * 錬金のロジックを実装
 */
export function judgeAlchemy(
  items: Item[],
  player: Player,
  itemBoxes: IPlayerMaterialItemRepository
): { alchemizedItem: AlchemyItem | undefined; deletedItemIds: string[] } {
  const deletedItemIds: string[] = []
  if (items.length !== 3) {
    return { alchemizedItem: undefined, deletedItemIds }
  }

  const kinds = items.map((item) => item.kind)

  // 種類ごとの出現回数をカウント
  const kindCount: Record<string, number> = kinds.reduce<Record<string, number>>((count, kind) => {
    // 明示的なundefinedチェックを追加
    if (typeof count[kind] === 'undefined' || isNaN(count[kind])) {
      count[kind] = 0
    }
    count[kind] += 1
    return count
  }, {})

  let alchemizedItem: AlchemyItem | undefined

  const itemCount = Object.keys(kindCount).length

  // 同じ種類が3つの場合
  if (itemCount === 1) {
    const kind = kinds[0]
    alchemizedItem = createAlchemyItem('all_same', kind)

    // 2つが同じで1つが違う種類の場合
  } else if (itemCount === 2) {
    const kindsArray = Object.keys(kindCount)
    const counts = Object.values(kindCount)

    // 1つの種類が2個、別の種類が1個あることを確認
    if (counts.includes(2) && counts.includes(1)) {
      const sameKind = kindsArray.find((kind) => kindCount[kind] === 2)
      if (sameKind !== undefined) {
        alchemizedItem = createAlchemyItem('two_same_one_diff', sameKind)
      }
    }

    // 全部違う種類の場合
  } else if (itemCount === 3) {
    alchemizedItem = createAlchemyItem('all_diff', kinds[0])
  } else {
    return { alchemizedItem: undefined, deletedItemIds }
  }

  // アイテム削除処理
  const itemsCopy = [...items]
  itemsCopy.forEach((item) => {
    try {
      itemBoxes.delete(player.id, item.id)
      deletedItemIds.push(item.id)
    } catch (error) {
      console.error(`Error deleting item with id: ${item.id}`, error)
    }
  })

  return { alchemizedItem, deletedItemIds }
}

/**
 * 種類ごとに対応する錬金アイテムを生成
 */
function createAlchemyItem(type: string, kind1: string): AlchemyItem {
  let itemType: AlchemyItemKind
  switch (type) {
    case 'all_same':
      // 3つとも同じ種類の場合のアイテム生成（種類に応じて異なるアイテムを作成）
      itemType = alchemyItemMapAllSame[kind1]
      break
    case 'two_same_one_diff':
      // 2つ同じで1つ違う種類の場合（組み合わせに応じたアイテムを生成）
      itemType = alchemyItemMapTwoSameOneDiff[kind1]
      break
    case 'all_diff':
      // 全部異なる場合のアイテム生成
      itemType = 'blackHole'
      break
    default:
      itemType = 'blackHole' // デフォルトのアイテム
  }

  return new AlchemyItem(uniqueId(), new Position(0, 0), Date.now(), itemType)
}

/**
 * 全ての素材アイテムが同じ時の錬金アイテムのマップ
 */
const alchemyItemMapAllSame: Record<string, AlchemyItemKind> = {
  fireOre: 'flamePillar',
  waterOre: 'waterRing',
  grassOre: 'flamePillar',
  herb: 'revivalItem',
}

/**
 * 素材アイテムが二つ同じ、一つ違う時の錬金アイテムのマップ
 */
const alchemyItemMapTwoSameOneDiff: Record<string, AlchemyItemKind> = {
  fireOre: 'explosion',
  waterOre: 'iceArrow',
  grassOre: 'trap',
  herb: 'healingPotion',
}
