import { IAlchemyPotRepository } from '../domain/IAlchemyPotRepository'
import { IAlchemyItemManger } from '../interface/IAlchemyItemManger'
import { IAlchemyItemRegister } from '../interface/IAlchemyItemRegister'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    alchemyPlugin: AlchemyPluginStore
  }
}

export interface AlchemyPluginStore {
  readonly alchemyPots: IAlchemyPotRepository
  readonly alchemyItemRegister: IAlchemyItemRegister
  readonly alchemyItemManager: IAlchemyItemManger
}
