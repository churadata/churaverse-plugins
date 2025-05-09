export interface IGame {
  setSynchroBreakPluginStore: () => void
  processTurnSequence: () => Promise<void>
}
