declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    screenRecordPlugin: ScreenRecordPluginStore
  }
}

export interface ScreenRecordPluginStore {
  isRecording: boolean
}
