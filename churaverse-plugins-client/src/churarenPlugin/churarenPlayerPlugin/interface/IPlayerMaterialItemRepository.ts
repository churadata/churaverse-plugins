import { Item } from '@churaverse/churaren-item-plugin-client/domain/item'

export interface IPlayerMaterialItemRepository {
  set: (playerId: string, item: Item) => void
  get: (playerId: string, itemIndex: number) => Item | undefined
  delete: (playerId: string, itemId: string) => void
  getAllItem: (playerId: string) => Item[]
  clearAll: () => void
}
