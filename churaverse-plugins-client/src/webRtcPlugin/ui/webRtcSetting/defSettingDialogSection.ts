import { SettingSection } from '../../../coreUiPlugin/settingDialog/settingSection'

declare module '../../../coreUiPlugin/settingDialog/settingDialog' {
  export interface SettingDialogSectionMap {
    peripheralSetting: SettingSection
  }
}
