import { PlayerNyokkiStatusIcon } from '../ui/synchroBreakIcon/playerNyokkiStatusIcon'
import { IPlayersCoinRepository } from '../interface/IPlayersCoinRepository'
import { INyokkiLogTextCreator } from '../interface/INyokkiLogTextCreator'

export interface SynchroBreakPluginStore {
  readonly synchroBreakIcons: Map<string, PlayerNyokkiStatusIcon>
  readonly playersCoinRepository: IPlayersCoinRepository
  readonly nyokkiLogTextCreator: INyokkiLogTextCreator
  timeLimit: number | undefined
  gameTurn: number | undefined
}

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    synchroBreakPlugin: SynchroBreakPluginStore
  }
}
