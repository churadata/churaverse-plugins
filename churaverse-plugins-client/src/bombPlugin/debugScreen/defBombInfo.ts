import { DebugDetailScreenSection } from '@churaverse/debug-screen-plugin-client/debugScreen/debugDetailScreenSection'

declare module '@churaverse/debug-screen-plugin-client/debugScreen/IDebugScreenContainer/IDebugDetailScreenContainer' {
  export interface DebugDetailScreenSettingSectionMap {
    bombInfo: DebugDetailScreenSection
  }
}

declare module '@churaverse/debug-screen-plugin-client/debugScreen/dataDumper' {
  interface DumpDataMap {
    bombCount: string
  }
}
