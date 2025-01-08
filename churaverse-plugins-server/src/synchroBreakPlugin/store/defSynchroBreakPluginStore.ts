import { IGame } from '../interface/IGame'
import { NyokkiCollection } from '../repository/nyokkiCollection'
import { BetCoinRepository } from '../repository/betCoinRepository'
import { PlayersCoinRepository } from '../repository/playersCoinRepository'

export interface SynchroBreakPluginStore {
  readonly game: IGame
  readonly nyokkiCollection: NyokkiCollection
  readonly playersCoinRepository: PlayersCoinRepository
  readonly betCoinRepository: BetCoinRepository
  timeLimit: number | undefined
  turnSelect: number | undefined
  readonly participants: Map<string, boolean>
}

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    synchroBreakPlugin: SynchroBreakPluginStore
  }
}
