import { IItemRepository } from '../domain/IItemRepository'
import { IAlchemyItemManager } from '../interface/IAlchemyItemManager'
import { IAlchemyItemRegister } from '../interface/IAlchemyItemRegister'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    churarenItemPlugin: ItemPluginStore
  }
}

export interface ItemPluginStore {
  readonly items: IItemRepository
  readonly alchemyItemManager: IAlchemyItemManager
  readonly alchemyItemRegister: IAlchemyItemRegister
}
