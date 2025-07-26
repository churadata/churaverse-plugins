import { IMainScene, Store } from 'churaverse-engine-server'
import { TrapPluginStore } from './defTrapPluginStore'
import { TrapRepository } from '../repository/trapRepository'
import '@churaverse/map-plugin-server/store/defMapPluginStore'

export function initTrapPluginStore(store: Store<IMainScene>): void {
  const trapPluginStore: TrapPluginStore = {
    traps: new TrapRepository(store.of('mapPlugin').mapManager.currentMap),
  }

  store.setInit('trapPlugin', trapPluginStore)
}
