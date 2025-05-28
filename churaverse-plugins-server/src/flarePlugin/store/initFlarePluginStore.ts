import { IMainScene, Store } from 'churaverse-engine-server'
import { FlarePluginStore } from './defFlarePluginStore'
import { FlareRepository } from '../repository/flareRepository'

export function initFlarePluginStore(store: Store<IMainScene>): void {
  const flarePluginStore: FlarePluginStore = {
    flares: new FlareRepository(store.of('mapPlugin').mapManager.currentMap),
  }

  store.setInit('flarePlugin', flarePluginStore)
}
