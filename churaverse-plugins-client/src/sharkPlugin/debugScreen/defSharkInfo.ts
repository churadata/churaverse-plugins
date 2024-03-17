import { DebugDetailScreenSection } from '../../debugScreenPlugin/debugScreen/debugDetailScreenSection'

declare module '../../debugScreenPlugin/debugScreen/IDebugScreenContainer/IDebugDetailScreenContainer' {
  export interface DebugDetailScreenSettingSectionMap {
    sharkInfo: DebugDetailScreenSection
  }
}

declare module '../../debugScreenPlugin/debugScreen/dataDumper' {
  interface DumpDataMap {
    sharkCount: string
  }
}
