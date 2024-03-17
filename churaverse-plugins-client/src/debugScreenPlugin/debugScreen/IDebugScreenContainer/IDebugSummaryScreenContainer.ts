import { IDialog } from '../../../coreUiPlugin/interface/IDialog'
import { DebugSummaryScreenSection } from '../debugSummaryScreenSection'

export interface IDebugSummaryScreenContainer extends IDialog<DebugSummaryScreenSection> {}

export interface DebugScreenSettingSectionMap {}

export type DebugScreenSectionId = keyof DebugScreenSettingSectionMap & string
