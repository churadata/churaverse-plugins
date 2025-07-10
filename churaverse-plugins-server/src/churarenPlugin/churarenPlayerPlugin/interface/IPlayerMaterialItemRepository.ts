import { Item } from '@churaverse/churaren-item-plugin-server/domain/item'

export interface IPlayerMaterialItemRepository {
  set: (playerId: string, item: Item) => void
  delete: (playerId: string, itemId: string) => void
  getAllItem: (playerId: string) => Item[]
  clear: (playerId: string) => void
  clearAll: () => void
}
