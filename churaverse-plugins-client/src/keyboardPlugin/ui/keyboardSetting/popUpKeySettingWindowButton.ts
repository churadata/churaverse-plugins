import { SettingSection } from '../../../coreUiPlugin/settingDialog/settingSection'
import { PopupKeySettingWindowButtonComponent } from './components/PopupKeySettingWindowButtonComponent'
import { DomManager } from 'churaverse-engine-client'
import { ISettingDialog } from '../../../coreUiPlugin/interface/ISettingDialog'
import { IKeyboardSettingPopUpWindow } from '../interface/IKeySettingPopUpWindow'
import { KeyboardPluginStore } from '../../store/defKeyboardPluginStore'
/**
 * キーバインドフォームを開くボタン要素のid
 */
export const POPUP_KEY_SETTING_WINDOW_BUTTON_ID = 'keySettingForm-open-button'

export class PopUpKeySettingWindowButton {
  public constructor(settingDialog: ISettingDialog, private readonly popupWindow: IKeyboardSettingPopUpWindow) {
    const content = DomManager.jsxToDom(PopupKeySettingWindowButtonComponent())
    settingDialog.addContent('keyboardSetting', content)

    this.setupPopupButton()
  }

  /**
   * キーバインド設定ウィンドウを開く
   */
  public popUpWindow(): void {
    this.popupWindow.openPopupWindow()
  }

  /**
   * 開くボタンを押下した時の挙動を設定する
   */
  private setupPopupButton(): void {
    const button = DomManager.getElementById(POPUP_KEY_SETTING_WINDOW_BUTTON_ID)

    button.onclick = () => {
      this.popUpWindow()
    }
  }
}

declare module '../../../coreUiPlugin/settingDialog/settingDialog' {
  export interface SettingDialogSectionMap {
    keyboardSetting: SettingSection
  }
}
