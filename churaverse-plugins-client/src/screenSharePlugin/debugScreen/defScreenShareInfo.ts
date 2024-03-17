import { DebugDetailScreenSection } from '../../debugScreenPlugin/debugScreen/debugDetailScreenSection'

declare module '../../debugScreenPlugin/debugScreen/IDebugScreenContainer/IDebugDetailScreenContainer' {
  export interface DebugDetailScreenSettingSectionMap {
    screenShareInfo: DebugDetailScreenSection
  }
}

declare module '../../debugScreenPlugin/debugScreen/dataDumper' {
  interface DumpDataMap {
    screenShareIsOn: string
    screenShareId: string
  }
}
