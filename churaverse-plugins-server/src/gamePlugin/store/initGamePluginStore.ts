import { Store, IMainScene } from 'churaverse-engine-server'
import { GamePluginStore } from './defGamePluginStore'
import { GameRepository } from '../repository/gameRepository'

export function initGamePluginStore(store: Store<IMainScene>): void {
  const pluginStore: GamePluginStore = {
    gameRepository: new GameRepository(),
  }

  store.setInit('gamePlugin', pluginStore)
}
