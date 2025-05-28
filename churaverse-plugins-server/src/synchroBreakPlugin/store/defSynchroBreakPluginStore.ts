import { IGame } from '../interface/IGame'
import { INyokkiRepository } from '../interface/INyokkiRepository'
import { IPlayersCoinRepository } from '../interface/IPlayersCoinRepository'
import { IBetCoinRepository } from '../interface/IBetCoinRepository'

export interface SynchroBreakPluginStore {
  readonly game: IGame
  readonly nyokkiRepository: INyokkiRepository
  readonly playersCoinRepository: IPlayersCoinRepository
  readonly betCoinRepository: IBetCoinRepository
  timeLimit: number | undefined
  turnSelect: number | undefined
}

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    synchroBreakPlugin: SynchroBreakPluginStore
  }
}
