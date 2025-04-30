import { IMainScene, Store } from 'churaverse-engine-server'
import { GamePluginStore } from './defGamePluginStore'
import { GameInfoRepository } from '../repository/gameInfoRepository'

export function initGamePluginStore(store: Store<IMainScene>): void {
  const gamePluginStore: GamePluginStore = {
    games: new GameInfoRepository(),
  }

  store.setInit('gamePlugin', gamePluginStore)
}
