import { IMainScene, Store } from 'churaverse-engine-server'
import { ItemRepository } from '../repository/itemRepository'
import { ItemPluginStore } from './defItemPluginStore'
import '@churaverse/map-plugin-server/store/defMapPluginStore'
import { AlchemyItemManager } from '../alchemyItemManager'

export function initItemPluginStore(store: Store<IMainScene>): void {
  const itemPluginStore: ItemPluginStore = {
    items: new ItemRepository(store.of('mapPlugin').mapManager.currentMap),
    alchemyItemManager: new AlchemyItemManager(),
  }

  store.setInit('churarenItemPlugin', itemPluginStore)
}

export function resetItemPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('churarenItemPlugin')
}
