import { Store, IMainScene } from 'churaverse-engine-client'
import { GamePluginStore } from './defGamePluginStore'
import { GameRepository } from '../repository/gameRepository'
import { GameDialogRepository } from '../repository/gameDialogRepository'
import { GameLogRenderer } from '../ui/logRenderer/gameLogRenderer'

export function initGamePluginStore(store: Store<IMainScene>): void {
  const pluginStore: GamePluginStore = {
    gameRepository: new GameRepository(),
    gameDialogRepository: new GameDialogRepository(),
    gameLogRenderer: new GameLogRenderer(store),
  }

  store.setInit('gamePlugin', pluginStore)
}
