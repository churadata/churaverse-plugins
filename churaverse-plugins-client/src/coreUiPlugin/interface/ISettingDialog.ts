import { IDialog } from '../domain/interface/IRender/IDialog'
import { SettingSection } from '../settingDialog/settingSection'

export interface ISettingDialog extends IDialog<SettingSection> {}

declare module './IDialogSwitcher' {
  export interface DialogMap {
    setting: ISettingDialog
  }
}
