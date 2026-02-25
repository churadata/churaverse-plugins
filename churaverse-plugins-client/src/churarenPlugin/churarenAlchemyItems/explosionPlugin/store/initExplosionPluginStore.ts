import { ExplosionRepository } from '../repository/explosionRepository'
import { ExplosionPluginStore } from './defExplosionPluginStore'
import { IExplosionAttackRenderer } from '../domain/IExplosionAttckRenderer'
import { IExplosionAttackRendererFactory } from '../domain/IExplosionAttackRendererFactory'
import { IMainScene, Store } from 'churaverse-engine-client'

export function initExplosionPluginStore(
  store: Store<IMainScene>,
  attackRendererFactory: IExplosionAttackRendererFactory | undefined
): void {
  if (attackRendererFactory === undefined) throw Error('attackRendererFactory is undefined')

  const explosionPluginStore: ExplosionPluginStore = {
    explosions: new ExplosionRepository(),
    explosionAttackRenderers: new Map<string, IExplosionAttackRenderer>(),
    explosionAttackRendererFactory: attackRendererFactory,
  }

  store.setInit('churarenExplosionPlugin', explosionPluginStore)
}

export function resetExplosionPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('churarenExplosionPlugin')
}
