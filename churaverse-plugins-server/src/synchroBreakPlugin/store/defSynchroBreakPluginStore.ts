import { IGame } from '../interface/IGame'
import { INyokkiCollection } from '../interface/INyokkiCollection'
import { IPlayersCoinRepository } from '../interface/IPlayersCoinRepository'
import { IBetCoinRepository } from '../interface/IBetCoinRepository'
import { INyokkiLogTextCreate } from '../interface/INyokkiLogTextCreate'

export interface SynchroBreakPluginStore {
  readonly game: IGame
  readonly nyokkiCollection: INyokkiCollection
  readonly playersCoinRepository: IPlayersCoinRepository
  readonly betCoinRepository: IBetCoinRepository
  timeLimit: number | undefined
  turnSelect: number | undefined
  readonly nyokkiLogTextCreate: INyokkiLogTextCreate
}

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    synchroBreakPlugin: SynchroBreakPluginStore
  }
}
