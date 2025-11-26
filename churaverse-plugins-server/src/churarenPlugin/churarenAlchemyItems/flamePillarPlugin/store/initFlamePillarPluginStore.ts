import { IMainScene, Store } from 'churaverse-engine-server'
import { FlamePillarPluginStore } from './defFlamePillarPluginStore'
import { FlamePillarRepository } from '../repository/flamePillarRepository'
import '@churaverse/map-plugin-server/store/defMapPluginStore'

export function initFlamePillarPluginStore(store: Store<IMainScene>): void {
  const flamePillarPluginStore: FlamePillarPluginStore = {
    flamePillars: new FlamePillarRepository(store.of('mapPlugin').mapManager.currentMap),
  }

  store.setInit('flamePillarPlugin', flamePillarPluginStore)
}
