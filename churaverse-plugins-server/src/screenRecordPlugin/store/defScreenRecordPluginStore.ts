declare module 'churaverse-engine-server' {
  export interface StoreInMain {
    screenRecordPlugin: ScreenRecordPluginStore
  }
}

export interface ScreenRecordPluginStore {
  isRecording: boolean
}
