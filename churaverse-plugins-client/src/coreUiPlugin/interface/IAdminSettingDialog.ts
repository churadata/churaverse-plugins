import { IDialog } from '../domain/interface/IRender/IDialog'
import { AdminSettingSection } from '../adminSettingDialog/adminSettingSection'

export interface IAdminSettingDialog extends IDialog<AdminSettingSection> {}

declare module './IDialogSwitcher' {
  export interface DialogMap {
    adminSetting: IAdminSettingDialog
  }
}
