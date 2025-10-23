import { BossAttackRepository } from '../repository/bossAttackRepository'
import { IMainScene, Store } from 'churaverse-engine-server'
import { BossAttackPluginStore } from './defBossAttackPluginStore'

export function initBossAttackPluginStore(store: Store<IMainScene>): void {
  const bossAttackPluginStore: BossAttackPluginStore = {
    bossAttacks: new BossAttackRepository(store.of('mapPlugin').mapManager.currentMap),
  }

  store.setInit('bossAttackPlugin', bossAttackPluginStore)
}

export function resetBossAttackPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('bossAttackPlugin')
}
