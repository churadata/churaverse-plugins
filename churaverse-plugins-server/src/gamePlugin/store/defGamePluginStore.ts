import { GameRepository } from '../repository/gameRepository'

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    gamePlugin: GamePluginStore
  }
}

export interface GamePluginStore {
  readonly gameRepository: GameRepository
}
