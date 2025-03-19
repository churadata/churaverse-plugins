import { ChurarenGameSequence } from '../logic/churarenGameSequence'

export interface ChurarenPluginStore {
  readyPlayers: Set<string>
  churarenGameSequence: ChurarenGameSequence
}

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    churarenPlugin: ChurarenPluginStore
  }
}
