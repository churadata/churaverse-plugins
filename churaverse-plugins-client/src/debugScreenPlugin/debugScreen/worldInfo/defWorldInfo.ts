import { DebugSummaryScreenSection } from '../debugSummaryScreenSection'

declare module '../../../debugScreenPlugin/debugScreen/IDebugScreenContainer/IDebugSummaryScreenContainer' {
  export interface DebugScreenSettingSectionMap {
    worldInfo: DebugSummaryScreenSection
  }
}

declare module '../../../debugScreenPlugin/debugScreen/dataDumper' {
  interface DumpDataMap {
    fps: string
    frontendVersion: string
    backendVersion: string
    deployVersion: string
  }
}
