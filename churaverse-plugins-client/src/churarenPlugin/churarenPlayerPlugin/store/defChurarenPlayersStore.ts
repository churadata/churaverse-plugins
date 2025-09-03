import { IGhostModePlayerRepository } from '../interface/IGhostModePlayerRepository'
import { IGhostPlayerListUi } from '../interface/IGhostPlayerListUi'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    churarenPlayerStore: ChurarenPlayersStore
  }
}

export interface ChurarenPlayersStore {
  ghostModePlayerRepository: IGhostModePlayerRepository
  ghostPlayerListUi: IGhostPlayerListUi
}
