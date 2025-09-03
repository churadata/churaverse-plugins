import { IItemRepository } from './IItemRepository'
import { Item } from './item'
import { ItemKind, ITEM_KINDS } from '../domain/itemKind'
import { Vector } from 'churaverse-engine-server'
import { WorldMap } from '@churaverse/map-plugin-server/domain/worldMap'
import { SendableObject } from '@churaverse/network-plugin-server/types/sendable'
import { uniqueId } from '@churaverse/churaren-core-plugin-server'
import { ChurarenItemInfo, ChurarenItemInfoMap } from '../message/churarenItemSpawnMessage'

/**
 * 時間経過済みのアイテムを削除する
 */
export function removeItems(items: IItemRepository): string[] {
  const deleteItems: string[] = []
  items.getAllId().forEach((itemId) => {
    const item = items.get(itemId)
    if (item?.isDespawn ?? false) {
      items.delete(itemId)
      deleteItems.push(itemId)
    }
  })
  return deleteItems
}

/**
 * アイテムの生成を行う
 */
export function generatedItemMap(items: IItemRepository, itemNum: number, worldMap: WorldMap): ChurarenItemInfoMap {
  const itemsMap: ChurarenItemInfoMap = {}
  for (let i = 0; i < itemNum; i++) {
    const item = new Item(uniqueId(), worldMap.getRandomPoint(), Date.now(), getRandomItemKind())
    if (items.get(item.id) !== undefined) continue
    itemsMap[item.id] = itemInfoToSendableObject(item)
    items.set(item.id, item)
  }
  return itemsMap
}

function itemInfoToSendableObject(item: Item): ChurarenItemInfo {
  const info: ChurarenItemInfo = {
    id: item.id,
    kind: item.kind,
    startPos: item.position.toVector() as Vector & SendableObject,
    spawnTime: item.spawnTime,
  }
  return info
}

function getRandomItemKind(): ItemKind {
  return ITEM_KINDS[Math.floor(Math.random() * ITEM_KINDS.length)]
}
