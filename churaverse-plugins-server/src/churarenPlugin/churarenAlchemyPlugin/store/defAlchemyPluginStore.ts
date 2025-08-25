import { IAlchemyPotRepository } from '../domain/IAlchemyPotRepository'
import { IAlchemyItemRecipeRepository } from '../interface/IAlchemyItemRecipeRepository'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    alchemyPlugin: AlchemyPluginStore
  }
}

export interface AlchemyPluginStore {
  readonly alchemyPot: IAlchemyPotRepository
  readonly alchemyItemRecipe: IAlchemyItemRecipeRepository
}
