import { IGameUiManager } from '../interface/IGameUiManager'
import { IGameLogRenderer } from '../interface/IGameLogRenderer'
import { IGameInfoRepository } from '../interface/IGameInfoRepository'
import { IGameSelectionListContainer } from '../interface/IGameSelectionListContainer'
import { IGameDescriptionDialogManager } from '../interface/IGameDescriptionDialogManager'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    gamePlugin: GamePluginStore
    gameInfo: GameInfoStore
  }
}

export interface GamePluginStore {
  readonly gameUiManager: IGameUiManager
  readonly gameLogRenderer: IGameLogRenderer
  readonly gameSelectionListContainer: IGameSelectionListContainer
  readonly gameDescriptionDialogManager: IGameDescriptionDialogManager
}

export interface GameInfoStore {
  readonly games: IGameInfoRepository
}
