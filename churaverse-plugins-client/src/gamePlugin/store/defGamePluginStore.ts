import { IGameUiManager } from '../interface/IGameUiManager'
import { IGameLogRenderer } from '../interface/IGameLogRenderer'
import { GameInfoRepository } from '../repository/gameInfoRepository'

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
  readonly games: GameInfoRepository
}