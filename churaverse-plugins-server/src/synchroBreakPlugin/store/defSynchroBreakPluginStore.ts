import { IGame } from '../interface/IGame'
import { NyokkiCollection } from '../repository/nyokkiCollection'
import { BetCoinRepository } from '../repository/betCoinRepository'
import { PlayersCoinRepository } from '../repository/playersCoinRepository'
import { INyokkiLogTextCreate } from '../interface/INyokkiLogTextCreate'

export interface SynchroBreakPluginStore {
  readonly game: IGame
  readonly nyokkiCollection: NyokkiCollection
  readonly playersCoinRepository: PlayersCoinRepository
  readonly betCoinRepository: BetCoinRepository
  timeLimit: number | undefined
  turnSelect: number | undefined
  readonly participants: Map<string, boolean>
  readonly nyokkiLogTextCreate: INyokkiLogTextCreate
}

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    synchroBreakPlugin: SynchroBreakPluginStore
  }
}
