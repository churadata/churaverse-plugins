export interface ChurarenPluginStore {
  timeLimit: number
}

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    churarenPlugin: ChurarenPluginStore
  }
}
