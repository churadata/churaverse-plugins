import { ChurarenGameSequence } from '../logic/churarenGameSequence'

export interface ChurarenPluginStore {
  timeLimit: number | undefined
  churarenGameSequence: ChurarenGameSequence
}

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    churarenPlugin: ChurarenPluginStore
  }
}
