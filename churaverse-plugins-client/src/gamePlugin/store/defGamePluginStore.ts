import { IGameUiManager } from '../interface/IGameUiManager'
import { IGameLogRenderer } from '../interface/IGameLogRenderer'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    gamePlugin: GamePluginStore
  }
}

export interface GamePluginStore {
  readonly gameUiManager: IGameUiManager
  readonly gameLogRenderer: IGameLogRenderer
}
