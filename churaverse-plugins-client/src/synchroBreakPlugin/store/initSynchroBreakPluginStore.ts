import { Store, IMainScene } from 'churaverse-engine-client'
import { SynchroBreakPluginStore } from './defSynchroBreakPluginStore'
import { UiManager } from '../ui/uiManager'
import { PlayersCoinRepository } from '../repository/playersCoinRepository'
import { DescriptionWindow } from '../ui/descriptionWindow/descriptionWindow'
import { PlayerRankDisplay } from '../ui/playerRankDisplay/playerRankDisplay'

export function initSynchroBreakPluginStore(store: Store<IMainScene>): void {
  const synchroBreakPluginStore: SynchroBreakPluginStore = {
    uiManager: new UiManager(),
    playersCoinRepository: new PlayersCoinRepository(),
    descriptionWindow: new DescriptionWindow(),
    playersRankDisplay: new Map<string, PlayerRankDisplay>(),
    timeLimit: 0,
  }

  store.setInit('synchroBreakPlugin', synchroBreakPluginStore)
}
