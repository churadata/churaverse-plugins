import { PlayerNyokkiStatusIcon } from '../ui/synchroBreakIcon/playerNyokkiStatusIcon'
import { IPlayersCoinRepository } from '../interface/IPlayersCoinRepository'

export interface SynchroBreakPluginStore {
  readonly synchroBreakIcons: Map<string, PlayerNyokkiStatusIcon>
  readonly playersCoinRepository: IPlayersCoinRepository
  timeLimit: number | undefined
}

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    synchroBreakPlugin: SynchroBreakPluginStore
  }
}
