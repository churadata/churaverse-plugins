import { IReadyPlayerRepository } from '../interface/IReadyPlayerRepository'
import { ChurarenGameSequence } from '../logic/churarenGameSequence'

export interface ChurarenPluginStore {
  readyPlayers: IReadyPlayerRepository
  churarenGameSequence: ChurarenGameSequence
}

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    churarenPlugin: ChurarenPluginStore
  }
}
