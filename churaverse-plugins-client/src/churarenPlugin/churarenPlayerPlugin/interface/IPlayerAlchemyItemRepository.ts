import { AlchemyItem } from '@churaverse/churaren-alchemy-plugin-client/domain/alchemyItem'

export interface IPlayerAlchemyItemRepository {
  set: (playerId: string, item: AlchemyItem) => void
  get: (playerId: string) => AlchemyItem | undefined
  delete: (playerId: string) => void
  clear: () => void
}
