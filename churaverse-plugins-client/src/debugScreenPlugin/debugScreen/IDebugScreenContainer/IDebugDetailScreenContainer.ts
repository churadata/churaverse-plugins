import { IDialog } from '@churaverse/core-ui-plugin-client/domain/interface/IRender/IDialog'
import { DebugDetailScreenSection } from '../debugDetailScreenSection'

export interface IDebugDetailScreenContainer extends IDialog<DebugDetailScreenSection> {}

export interface DebugDetailScreenSettingSectionMap {}

export type DebugDetailScreenSectionId = keyof DebugDetailScreenSettingSectionMap & string
