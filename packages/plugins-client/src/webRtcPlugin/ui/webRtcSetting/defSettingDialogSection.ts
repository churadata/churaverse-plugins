import { SettingSection } from '@churaverse/core-ui-plugin-client/settingDialog/settingSection'

declare module '@churaverse/core-ui-plugin-client/settingDialog/settingDialog' {
  export interface SettingDialogSectionMap {
    peripheralSetting: SettingSection
  }
}
