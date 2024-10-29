import { GameRepository } from '../repository/gameRepository'
import { GameDialogRepository } from '../repository/gameDialogRepository'
import { IGameLogRenderer } from '../interface/IGameLogRenderer'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    gamePlugin: GamePluginStore
  }
}

export interface GamePluginStore {
  readonly gameRepository: GameRepository
  readonly gameDialogRepository: GameDialogRepository
  readonly gameLogRenderer: IGameLogRenderer
}
