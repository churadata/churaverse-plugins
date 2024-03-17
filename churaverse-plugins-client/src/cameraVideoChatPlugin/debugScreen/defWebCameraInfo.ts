import { DebugDetailScreenSection } from '../../debugScreenPlugin/debugScreen/debugDetailScreenSection'

declare module '../../debugScreenPlugin/debugScreen/IDebugScreenContainer/IDebugDetailScreenContainer' {
  export interface DebugDetailScreenSettingSectionMap {
    webCameraInfo: DebugDetailScreenSection
  }
}

declare module '../../debugScreenPlugin/debugScreen/dataDumper' {
  interface DumpDataMap {
    webCameraIsOn: string
    webCameraId: string
  }
}
