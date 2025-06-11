import { INyokkiRepository } from '../interface/INyokkiRepository'
import { IPlayersCoinRepository } from '../interface/IPlayersCoinRepository'
import { IBetCoinRepository } from '../interface/IBetCoinRepository'
import { INyokkiLogTextCreate } from '../interface/INyokkiLogTextCreate'

export interface SynchroBreakPluginStore {
  readonly nyokkiRepository: INyokkiRepository
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
