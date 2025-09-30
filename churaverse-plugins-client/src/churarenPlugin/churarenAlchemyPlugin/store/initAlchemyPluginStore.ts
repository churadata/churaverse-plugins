import { IMainScene, Store } from 'churaverse-engine-client'
import { AlchemyPluginStore } from './defAlchemyPluginStore'
import { AlchemyPotRepository } from '../repository/alchemyPotRepository'
import { IAlchemyPotRenderer } from '../domain/IAlchemyPotRenderer'
import { IAlchemyPotRendererFactory } from '../domain/IAlchemyPotRendererFactory'
import { AlchemyItemManager } from '../alchemyItemManager'

export function initAlchemyPluginStore(
  scene: Phaser.Scene,
  store: Store<IMainScene>,
  rendererFactory: IAlchemyPotRendererFactory | undefined
): void {
  if (rendererFactory === undefined) throw Error('rendererFactory is undefined')

  const alchemyPluginStore: AlchemyPluginStore = {
    alchemyPots: new AlchemyPotRepository(),
    alchemyPotRenderers: new Map<string, IAlchemyPotRenderer>(),
    alchemyPotRendererFactory: rendererFactory,
    alchemyItemManager: new AlchemyItemManager(scene),
  }

  store.setInit('alchemyPlugin', alchemyPluginStore)
}

export function resetAlchemyPluginStore(store: Store<IMainScene>): void {
  store.deleteStoreOf('alchemyPlugin')
}
