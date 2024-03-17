import { AdminSettingSection } from '../../coreUiPlugin/adminSettingDialog/adminSettingSection'

declare module '../../coreUiPlugin/adminSettingDialog/adminSettingDialog' {
  export interface AdminSettingDialogSectionMap {
    mapSetting: AdminSettingSection
  }
}
