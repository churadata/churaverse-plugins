import { Store, IMainScene } from 'churaverse-engine-client'
import { IBombRenderer } from '../domain/IBombRenderer'
import { IBombRendererFactory } from '../domain/IBombRendererFactory'
import { BombRepository } from '../repository/bombRepository'
import { BombPluginStore } from './defBombPluginStore'

export function initBombPluginStore(store: Store<IMainScene>, rendererFactory: IBombRendererFactory | undefined): void {
  if (rendererFactory === undefined) throw Error('rendererFactory is undefined')

  const bombPluginStore: BombPluginStore = {
    bombs: new BombRepository(),
    bombRenderers: new Map<string, IBombRenderer>(),
    bombRendererFactory: rendererFactory,
  }

  store.setInit('bombPlugin', bombPluginStore)
}
