import { Store, IMainScene } from 'churaverse-engine-client'
import { GameInfoStore, GamePluginStore } from './defGamePluginStore'
import { GameLogRenderer } from '../ui/logRenderer/gameLogRenderer'
import { GameUiRegister } from '../gameUiRegister'
import { GameUiManager } from '../gameUiManager'
import { GameInfoRepository } from '../repository/gameInfoRepository'

export function initGamePluginStore(store: Store<IMainScene>, gameUiRegister: GameUiRegister): void {
  const pluginStore: GamePluginStore = {
    gameUiManager: new GameUiManager(gameUiRegister),
    gameLogRenderer: new GameLogRenderer(store),
  }

  const gameInfoStore: GameInfoStore = { games: new GameInfoRepository() }

  store.setInit('gamePlugin', pluginStore)
  store.setInit('gameInfo', gameInfoStore)
}
