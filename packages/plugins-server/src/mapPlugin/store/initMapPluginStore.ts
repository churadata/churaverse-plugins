import { IMainScene, Store } from 'churaverse-engine-server'
import { MapManager } from '../mapManager'
import { MapPluginStore } from './defMapPluginStore'

export function initMapPluginStore(store: Store<IMainScene>, mapManager: MapManager): void {
  const mapPluginStore: MapPluginStore = {
    mapManager,
  }

  store.setInit('mapPlugin', mapPluginStore)
}
