import { DebugDetailScreenSection } from '../../debugScreenPlugin/debugScreen/debugDetailScreenSection'

declare module '../../debugScreenPlugin/debugScreen/IDebugScreenContainer/IDebugDetailScreenContainer' {
  export interface DebugDetailScreenSettingSectionMap {
    voiceChatInfo: DebugDetailScreenSection
  }
}

declare module '../../debugScreenPlugin/debugScreen/dataDumper' {
  interface DumpDataMap {
    microphoneIsOn: string
    megaphoneIsOn: string
  }
}
