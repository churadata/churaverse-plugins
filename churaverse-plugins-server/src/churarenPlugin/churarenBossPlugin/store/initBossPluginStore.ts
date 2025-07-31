import { IMainScene, Store } from 'churaverse-engine-server'
import { BossRepository } from '../repository/bossRepository'
import { BossPluginStore } from './defBossPluginStore'

export function initBossPluginStore(store: Store<IMainScene>): void {
  const bossPluginStore: BossPluginStore = {
    bosses: new BossRepository(store.of('mapPlugin').mapManager.currentMap),
  }

  store.setInit('bossPlugin', bossPluginStore)
}

export function resetBossPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('bossPlugin')
}
