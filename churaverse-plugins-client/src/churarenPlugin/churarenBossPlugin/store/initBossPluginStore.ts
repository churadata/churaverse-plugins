import { IMainScene, Store } from 'churaverse-engine-client'
import { IBossRendererFactory } from '../domain/IBossRendererFactory'
import { BossPluginStore } from './defBossPluginStore'
import { BossRepository } from '../repository/bossRepository'
import { IBossRenderer } from '../domain/IBossRenderer'
import { BossDamageCauseLogRenderer } from '../ui/damageCauseLog/bossDamageCauseLogRenderer'
import { BossDamageCauseLogRepository } from '../ui/damageCauseLog/bossDamageLogRepository'

export function initBossPluginStore(store: Store<IMainScene>, rendererFactory: IBossRendererFactory | undefined): void {
  if (rendererFactory === undefined) throw Error('rendererFactory is undefined')

  const bossPluginStore: BossPluginStore = {
    bosses: new BossRepository(),
    bossRenderers: new Map<string, IBossRenderer>(),
    bossRendererFactory: rendererFactory,
    damageCauseLogRenderer: new BossDamageCauseLogRenderer(store.of('coreUiPlugin').fadeOutLogRenderer),
    damageCauseLogRepository: new BossDamageCauseLogRepository(),
  }

  store.setInit('bossPlugin', bossPluginStore)
}

export function resetBossPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('bossPlugin')
}
