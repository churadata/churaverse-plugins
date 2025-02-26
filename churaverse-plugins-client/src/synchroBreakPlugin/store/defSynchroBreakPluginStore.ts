export interface SynchroBreakPluginStore {
  timeLimit: number
}

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    synchroBreakPlugin: SynchroBreakPluginStore
  }
}
