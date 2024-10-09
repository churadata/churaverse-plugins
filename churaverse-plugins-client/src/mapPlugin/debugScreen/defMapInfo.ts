import { DebugDetailScreenSection } from '@churaverse/debug-screen-plugin-client/debugScreen/debugDetailScreenSection'

declare module '@churaverse/debug-screen-plugin-client/debugScreen/IDebugScreenContainer/IDebugDetailScreenContainer' {
  export interface DebugDetailScreenSettingSectionMap {
    mapInfo: DebugDetailScreenSection
  }
}

declare module '@churaverse/debug-screen-plugin-client/debugScreen/IDebugScreenContainer/IDebugSummaryScreenContainer' {
  export interface DebugScreenSettingSectionMap {
    worldInfo: DebugDetailScreenSection
  }
}

declare module '@churaverse/debug-screen-plugin-client/debugScreen/dataDumper' {
  interface DumpDataMap {
    collisionCount: string
    spawnCount: string
    worldName: string
    worldSize: string
  }
}
