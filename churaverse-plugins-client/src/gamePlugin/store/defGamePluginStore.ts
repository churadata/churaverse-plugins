import { GameUiManager } from '../gameUiManager'
import { GameLogRenderer } from '../ui/logRenderer/gameLogRenderer'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    gamePlugin: GamePluginStore
  }
}

export interface GamePluginStore {
  readonly gameUiManager: GameUiManager
  readonly gameLogRenderer: GameLogRenderer
}
