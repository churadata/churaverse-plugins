export interface IGame {
  getPluginStores: () => void
  processTurnSequence: () => Promise<void>
}
