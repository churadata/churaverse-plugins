import { IMainScene, Store } from 'churaverse-engine-server'
import { SharkPluginStore } from './defSharkPluginStore'
import { SharkRepository } from '../repository/sharkRepository'

export function initSharkPluginStore(store: Store<IMainScene>): void {
  const sharkPluginStore: SharkPluginStore = {
    sharks: new SharkRepository(store.of('mapPlugin').mapManager.currentMap),
  }

  store.setInit('sharkPlugin', sharkPluginStore)
}
