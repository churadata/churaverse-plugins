import { TopBarIconRenderer } from '../topBarIcon'
import { IDialogSwitcher } from '../interface/IDialogSwitcher'
import { ISettingDialog } from '../interface/ISettingDialog'
import { ITopBarIconContainer } from '../interface/ITopBarIconContainer'

import SETTING_ICON_PATH from '../assets/gear.png'

export class SettingIcon extends TopBarIconRenderer {
  public constructor(
    private readonly switcher: IDialogSwitcher,
    dialog: ISettingDialog,
    iconContainer: ITopBarIconContainer,
    iconPath: string = SETTING_ICON_PATH
  ) {
    super({
      activeIconImgPath: iconPath,
      inactiveIconImgPath: iconPath,
      onClick: (isActive) => {
        this.onClick(isActive)
      },
      isActive: false,
      order: -50,
    })

    iconContainer.addIcon(this)
    switcher.add('setting', dialog, () => {
      super.deactivate()
    })
  }

  /** buttonが押されたときの動作 */
  private onClick(isActive: boolean): void {
    if (isActive) {
      this.switcher.close()
    } else {
      this.switcher.open('setting', () => {
        super.activate()
      })
    }
  }
}
