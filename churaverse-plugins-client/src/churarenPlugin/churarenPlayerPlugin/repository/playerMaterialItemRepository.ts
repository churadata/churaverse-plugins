import { IPlayerMaterialItemRepository } from '../interface/IPlayerMaterialItemRepository'
import { Item } from '@churaverse/churaren-item-plugin-client/domain/item'

export class PlayerMaterialItemRepository implements IPlayerMaterialItemRepository {
  private readonly playerItems = new Map<string, Item[]>()

  public set(playerId: string, item: Item): void {
    if (!this.playerItems.has(playerId)) {
      this.playerItems.set(playerId, [])
    }
    this.playerItems.get(playerId)?.push(item)
  }

  public get(playerId: string, itemIndex: number): Item | undefined {
    return this.playerItems.get(playerId)?.[itemIndex]
  }

  public delete(playerId: string, itemId: string): void {
    const items = this.playerItems.get(playerId)
    if (items !== undefined) {
      const index = items.findIndex((item) => item.itemId === itemId)
      if (index !== -1) {
        items.splice(index, 1)
      }
    }
  }

  public getAllItem(playerId: string): Item[] {
    return this.playerItems.get(playerId) ?? []
  }

  public clearAll(): void {
    this.playerItems.clear()
  }
}
