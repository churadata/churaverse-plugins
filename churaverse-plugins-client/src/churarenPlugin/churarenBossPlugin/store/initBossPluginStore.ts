import { IMainScene, Store } from 'churaverse-engine-client'
import { IBossRendererFactory } from '../domain/IBossRendererFactory'
import { BossPluginStore } from './defBossPluginStore'
import { BossRepository } from '../repository/bossRepository'
import { IBossRenderer } from '../domain/IBossRenderer'
import { DamageCauseLogRenderer } from '../ui/damageCauseLog/damageCauseLogRenderer'
import { DamageCauseLogRepository } from '../ui/damageCauseLog/deathLogRepository'

export function initBossPluginStore(store: Store<IMainScene>, rendererFactory: IBossRendererFactory | undefined): void {
  if (rendererFactory === undefined) throw Error('rendererFactory is undefined')

  const bossPluginStore: BossPluginStore = {
    bosses: new BossRepository(),
    bossRenderers: new Map<string, IBossRenderer>(),
    bossRendererFactory: rendererFactory,
    damageCauseLogRenderer: new DamageCauseLogRenderer(store.of('coreUiPlugin').fadeOutLogRenderer),
    damageCauseLogRepository: new DamageCauseLogRepository(),
  }

  store.setInit('bossPlugin', bossPluginStore)
}

export function resetBossPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('bossPlugin')
}