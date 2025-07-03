import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-server/domain/alchemyItem'

export interface IPlayerAlchemyItemRepository {
  set: (playerId: string, item: AlchemyItem) => void
  delete: (playerId: string) => void
  get: (playerId: string) => AlchemyItem | undefined
  clearAll: () => void
}
