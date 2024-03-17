import { SettingSection } from '../../../../plugins/coreUiPlugin/settingDialog/settingSection'

declare module '../../../../plugins/coreUiPlugin/settingDialog/settingDialog' {
  export interface SettingSectionMap {
    keyboardSetting: SettingSection
  }
}
