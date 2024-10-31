import { UiManager } from '../ui/uiManager'
import { IPlayersCoinRepository } from '../interface/IPlayersCoinRepository'
import { DescriptionWindow } from '../ui/descriptionWindow/descriptionWindow'
import { PlayerRankDisplay } from '../ui/playerRankDisplay/playerRankDisplay'

export interface SynchroBreakPluginStore {
  readonly uiManager: UiManager
  readonly playersCoinRepository: IPlayersCoinRepository
  readonly descriptionWindow: DescriptionWindow
  readonly playersRankDisplay: Map<string, PlayerRankDisplay>
  timeLimit: number
}

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    synchroBreakPlugin: SynchroBreakPluginStore
  }
}
