import { FadeOutLogRenderer } from '../fadeOutLog/fadeOutLogRenderer'
import { IAdminSettingDialog } from '../interface/IAdminSettingDialog'
import { IDialogSwitcher } from '../interface/IDialogSwitcher'
import { IFocusTargetRepository } from '../interface/IFocusTargetRepository'
import { ISettingDialog } from '../interface/ISettingDialog'
import { ITopBarIconContainer } from '../interface/ITopBarIconContainer'
import { ExitButton } from '../exit/exitButton'

declare module 'churaverse-engine-client' {
  export interface StoreInMain {
    coreUiPlugin: CoreUiPluginStore
  }
}
export interface CoreUiPluginStore {
  exitButton: ExitButton
  readonly topBarIconContainer: ITopBarIconContainer
  readonly settingDialog: ISettingDialog
  readonly adminSettingDialog: IAdminSettingDialog
  readonly switcher: IDialogSwitcher
  readonly fadeOutLogRenderer: FadeOutLogRenderer
  readonly focusTargetRepository: IFocusTargetRepository
}
