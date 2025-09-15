import { AlchemyItemManager } from '../alchemyItemManager'
import { IItemRepository } from '../domain/IItemRepository'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    churarenItemPlugin: ItemPluginStore
  }
}

export interface ItemPluginStore {
  readonly items: IItemRepository
  readonly alchemyItemManager: AlchemyItemManager
}
