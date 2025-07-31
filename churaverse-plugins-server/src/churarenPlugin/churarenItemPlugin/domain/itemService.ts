import { IItemRepository } from './IItemRepository'
import { Item } from './item'
import { ItemKind, itemKinds } from '../domain/itemKind'
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
 * アイテムの生成をfrontendに通知する
 */
export function sendGeneratedItems(
  items: IItemRepository,
  participantNum: number,
  worldMap: WorldMap,
  sendItem: (itemsMap: ChurarenItemInfoMap) => void
): void {
  const multiplier = 3 // プレイヤー数に掛ける倍率
  const baseOffset = 10 // 基本オフセット値
  const maxItemNum = 40 // 最大アイテム数
  const itemsMap: ChurarenItemInfoMap = {}
  const itemNum = Math.min(participantNum * multiplier + baseOffset, maxItemNum)
  for (let i = 0; i < itemNum; i++) {
    const item = new Item(uniqueId(), worldMap.getRandomPoint(), Date.now(), getRandomItemKind())
    if (items.get(item.id) !== undefined) continue
    itemsMap[item.id] = itemInfoToSendableObject(item)
    items.set(item.id, item)
  }
  sendItem(itemsMap)
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
  return itemKinds[Math.floor(Math.random() * itemKinds.length)]
}
