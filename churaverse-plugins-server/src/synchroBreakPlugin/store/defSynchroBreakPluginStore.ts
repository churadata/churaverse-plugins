export interface SynchroBreakPluginStore {
  timeLimit: number | undefined
}

declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    synchroBreakPlugin: SynchroBreakPluginStore
  }
}
