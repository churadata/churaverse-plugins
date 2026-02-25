import { BossAttackRepository } from '../repository/bossAttackRepository'
import { IMainScene, Store } from 'churaverse-engine-client'

import { IBossAttackRenderer } from '../domain/IBossAttackRenderer'
import { IBossAttackRendererFactory } from '../domain/IBossAttackRendererFactory'
import { BossAttackPluginStore } from './defBossAttackPluginStore'

export function initBossAttackPluginStore(
  store: Store<IMainScene>,
  rendererFactory: IBossAttackRendererFactory | undefined
): void {
  if (rendererFactory === undefined) throw Error('rendererFactory is undefined')

  const bossAttackPluginStore: BossAttackPluginStore = {
    bossAttacks: new BossAttackRepository(),
    bossAttackRenderers: new Map<string, IBossAttackRenderer>(),
    bossAttackRendererFactory: rendererFactory,
  }

  store.setInit('bossAttackPlugin', bossAttackPluginStore)
}

export function resetBossAttackPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('bossAttackPlugin')
}
