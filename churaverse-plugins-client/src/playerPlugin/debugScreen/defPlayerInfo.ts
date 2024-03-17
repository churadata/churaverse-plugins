import { DebugSummaryScreenSection } from '../../debugScreenPlugin/debugScreen/debugSummaryScreenSection'

declare module '../../debugScreenPlugin/debugScreen/IDebugScreenContainer/IDebugSummaryScreenContainer' {
  export interface DebugScreenSettingSectionMap {
    playerInfo: DebugSummaryScreenSection
  }
}

declare module '../../debugScreenPlugin/debugScreen/dataDumper' {
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
