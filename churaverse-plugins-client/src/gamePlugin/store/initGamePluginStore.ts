import { Store, IMainScene } from 'churaverse-engine-client'
import { GameInfoStore, GamePluginStore } from './defGamePluginStore'
import { GameLogRenderer } from '../ui/logRenderer/gameLogRenderer'
import { GameUiRegister } from '../gameUiRegister'
import { GameUiManager } from '../gameUiManager'
import { GameInfoRepository } from '../repository/gameInfoRepository'
import { GameSelectionListContainer } from '../ui/gameList/gameSelectionListContainer'
import { GameDescriptionDialogManager } from '../gameDescriptionDialogManager'
import { CountdownTimer } from '../ui/countdownTimer/countdownTimer'

export function initGamePluginStore(store: Store<IMainScene>, gameUiRegister: GameUiRegister): void {
  const pluginStore: GamePluginStore = {
    gameUiManager: new GameUiManager(gameUiRegister),
    gameLogRenderer: new GameLogRenderer(store),
    gameSelectionListContainer: new GameSelectionListContainer(),
    gameDescriptionDialogManager: new GameDescriptionDialogManager(),
    countdownTimer: new CountdownTimer(),
  }

  const gameInfoStore: GameInfoStore = { games: new GameInfoRepository() }

  store.setInit('gamePlugin', pluginStore)
  store.setInit('gameInfo', gameInfoStore)
}
