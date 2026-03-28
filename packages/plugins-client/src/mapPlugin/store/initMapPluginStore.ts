import { Store, IMainScene } from 'churaverse-engine-client'
import { MapManager } from '../mapManager'
import { MapPluginStore } from './defMapPluginStore'

export function initMapPluginStore(store: Store<IMainScene>, mapManager: MapManager): void {
  const mapPluginStore: MapPluginStore = {
    mapManager,
  }

  store.setInit('mapPlugin', mapPluginStore)
}
