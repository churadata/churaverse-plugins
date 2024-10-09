import { DebugSummaryScreenSection } from '@churaverse/debug-screen-plugin-client/debugScreen/debugSummaryScreenSection'

declare module '@churaverse/debug-screen-plugin-client/debugScreen/IDebugScreenContainer/IDebugSummaryScreenContainer' {
  export interface DebugScreenSettingSectionMap {
    playerInfo: DebugSummaryScreenSection
  }
}

declare module '@churaverse/debug-screen-plugin-client/debugScreen/dataDumper' {
  interface DumpDataMap {
    playerId: string
    playerName: string
    playerColor: string
    playerHp: string
    playerPosition: string
    playerDirection: string
    playerRole: string
  }
}
