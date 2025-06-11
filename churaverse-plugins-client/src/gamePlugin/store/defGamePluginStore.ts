import { IGameUiManager } from '../interface/IGameUiManager'
import { IGameLogRenderer } from '../interface/IGameLogRenderer'
import { IGameInfoRepository } from '../interface/IGameInfoRepository'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    gamePlugin: GamePluginStore
    gameInfo: GameInfoStore
  }
}

export interface GamePluginStore {
  readonly gameUiManager: IGameUiManager
  readonly gameLogRenderer: IGameLogRenderer
}

export interface GameInfoStore {
  readonly games: IGameInfoRepository
}
