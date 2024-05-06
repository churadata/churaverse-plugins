import { AdminSettingSection } from '@churaverse/core-ui-plugin-client/adminSettingDialog/adminSettingSection'

declare module '@churaverse/core-ui-plugin-client/adminSettingDialog/adminSettingDialog' {
  export interface AdminSettingDialogSectionMap {
    mapSetting: AdminSettingSection
  }
}
