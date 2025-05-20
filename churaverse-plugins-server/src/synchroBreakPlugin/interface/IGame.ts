import { SynchroBreakPluginStore } from '../store/defSynchroBreakPluginStore'

export interface IGame {
  processTurnSequence: () => Promise<void>
  getSynchroBreakPluginStore: (synchroBreakPluginStore: SynchroBreakPluginStore) => void
}
