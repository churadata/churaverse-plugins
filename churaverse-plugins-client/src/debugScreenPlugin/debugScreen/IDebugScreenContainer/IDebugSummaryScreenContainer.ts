import { IDialog } from '@churaverse/core-ui-plugin-client/domain/interface/IRender/IDialog'
import { DebugSummaryScreenSection } from '../debugSummaryScreenSection'

export interface IDebugSummaryScreenContainer extends IDialog<DebugSummaryScreenSection> {}

export interface DebugScreenSettingSectionMap {}

export type DebugScreenSectionId = keyof DebugScreenSettingSectionMap & string
