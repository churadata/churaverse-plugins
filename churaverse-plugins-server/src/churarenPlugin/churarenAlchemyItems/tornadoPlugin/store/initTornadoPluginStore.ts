import { IMainScene, Store } from 'churaverse-engine-server'
import { TornadoPluginStore } from './defTornadoPluginStore'
import { TornadoRepository } from '../repository/tornadoRepository'
import '@churaverse/map-plugin-server/store/defMapPluginStore'

export function initTornadoPluginStore(store: Store<IMainScene>): void {
  const tornadoPluginStore: TornadoPluginStore = {
    tornados: new TornadoRepository(store.of('mapPlugin').mapManager.currentMap),
  }

  store.setInit('tornadoPlugin', tornadoPluginStore)
}
