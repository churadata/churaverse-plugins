import { IDialog } from '../../../coreUiPlugin/interface/IDialog'
import { DebugSummaryScreenSection } from '../debugSummaryScreenSection'

export interface IDebugSummaryScreenContainer extends IDialog<DebugSummaryScreenSection> {}

export interface DebugScreenSettingSectionMap {
  worldInfo: DebugSummaryScreenSection
}

export type DebugScreenSectionId = keyof DebugScreenSettingSectionMap & string
