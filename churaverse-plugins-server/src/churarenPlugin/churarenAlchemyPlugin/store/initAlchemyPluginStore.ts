import { IMainScene, Store } from 'churaverse-engine-server'
import { AlchemyPluginStore } from './defAlchemyPluginStore'
import '@churaverse/map-plugin-server/store/defMapPluginStore'
import { AlchemyPotRepository } from '../repository/alchemyPotRepository'
import { AlchemyItemManager } from '../alchemyItemManager'

export function initAlchemyPluginStore(store: Store<IMainScene>): void {
  const alchemyItemManager = new AlchemyItemManager()
  const alchemyPluginStore: AlchemyPluginStore = {
    alchemyPots: new AlchemyPotRepository(store.of('mapPlugin').mapManager.currentMap),
    alchemyItemRegister: alchemyItemManager,
    alchemyItemManager,
  }
  store.setInit('alchemyPlugin', alchemyPluginStore)
}

export function resetAlchemyPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('alchemyPlugin')
}
