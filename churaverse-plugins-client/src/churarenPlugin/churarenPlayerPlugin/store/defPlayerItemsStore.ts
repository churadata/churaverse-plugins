import { IItemRenderer } from '@churaverse/churaren-item-plugin-client/domain/IItemRenderer'
import { IPlayerMaterialItemRepository } from '../interface/IPlayerMaterialItemRepository'
import { IMaterialItemBoxContainer } from '../interface/IMaterialItemBoxContainer'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    playerItemStore: PlayerItemsStore
  }
}

export interface PlayerItemsStore {
  materialItems: IPlayerMaterialItemRepository
  materialItemBoxContainer: IMaterialItemBoxContainer
  materialItemRenderers: Map<string, IItemRenderer>
  // TODO: AlchemyItemのrepository等の追加
}
