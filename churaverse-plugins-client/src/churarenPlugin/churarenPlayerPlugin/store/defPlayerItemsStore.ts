import { IItemRenderer } from '@churaverse/churaren-item-plugin-client/domain/IItemRenderer'
import { IPlayerMaterialItemRepository } from '../interface/IPlayerMaterialItemRepository'
import { IMaterialItemBoxContainer } from '../interface/IMaterialItemBoxContainer'
import { IPlayerAlchemyItemRepository } from '../interface/IPlayerAlchemyItemRepository'
import { IAlchemyItemBoxContainer } from '../interface/IAlchemyItemBoxContainer'
import { IAlchemyItemRenderer } from '@churaverse/churaren-alchemy-plugin-client/domain/IAlchemyItemRenderer'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    playerItemStore: PlayerItemsStore
  }
}

export interface PlayerItemsStore {
  materialItems: IPlayerMaterialItemRepository
  materialItemBoxContainer: IMaterialItemBoxContainer
  materialItemRenderers: Map<string, IItemRenderer>
  alchemyItem: IPlayerAlchemyItemRepository
  alchemyItemBoxContainer: IAlchemyItemBoxContainer
  alchemyItemRenderers: Map<string, IAlchemyItemRenderer>
}
