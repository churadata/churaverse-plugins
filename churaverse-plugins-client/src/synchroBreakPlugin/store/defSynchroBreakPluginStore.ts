import { DescriptionWindow } from '../ui/descriptionWindow/descriptionWindow'

export interface SynchroBreakPluginStore {
  readonly descriptionWindow: DescriptionWindow
  timeLimit: number
}

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    synchroBreakPlugin: SynchroBreakPluginStore
  }
}
