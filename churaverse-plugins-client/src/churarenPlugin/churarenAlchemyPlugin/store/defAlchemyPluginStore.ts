import { AlchemyItemManager } from '../alchemyItemManager'
import { IAlchemyPotRenderer } from '../domain/IAlchemyPotRenderer'
import { IAlchemyPotRendererFactory } from '../domain/IAlchemyPotRendererFactory'
import { AlchemyPotRepository } from '../repository/alchemyPotRepository'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    alchemyPlugin: AlchemyPluginStore
  }
}

export interface AlchemyPluginStore {
  alchemyPots: AlchemyPotRepository
  alchemyPotRenderers: Map<string, IAlchemyPotRenderer>
  alchemyPotRendererFactory: IAlchemyPotRendererFactory
  alchemyItemManager: AlchemyItemManager
}
