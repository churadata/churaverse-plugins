import { IMainScene, Store } from 'churaverse-engine-server'
import { AlchemyPluginStore } from './defAlchemyPluginStore'
import '@churaverse/map-plugin-server/store/defMapPluginStore'
import { AlchemyPotRepository } from '../repository/alchemyPotRepository'
import { AlchemyItemRecipeRepository } from '../repository/alchemyItemRecipeRepository'

export function initAlchemyPluginStore(store: Store<IMainScene>): void {
  const alchemyPluginStore: AlchemyPluginStore = {
    alchemyPot: new AlchemyPotRepository(store.of('mapPlugin').mapManager.currentMap),
    alchemyItemRecipe: new AlchemyItemRecipeRepository(),
  }
  store.setInit('alchemyPlugin', alchemyPluginStore)
}

export function resetAlchemyPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('alchemyPlugin')
}
