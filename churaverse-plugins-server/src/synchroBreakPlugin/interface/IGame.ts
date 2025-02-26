import { SynchroBreakPluginStore } from '../store/defSynchroBreakPluginStore'

export interface IGame {
  readonly isActive: boolean
  start: (gameOwner: string) => Promise<void>
  end: () => void
  gameStartCount: () => Promise<void>
  countdownTurnTimer: () => Promise<void>
  getSynchroBreakPluginStore: (synchroBreakPluginStore: SynchroBreakPluginStore) => void
  // abort: () => void
}
