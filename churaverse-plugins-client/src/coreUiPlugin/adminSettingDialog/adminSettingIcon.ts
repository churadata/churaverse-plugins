import { PlayerRole } from '@churaverse/player-plugin-client/types/playerRole'
import { IAdminSettingDialog } from '../interface/IAdminSettingDialog'
import { IDialogSwitcher } from '../interface/IDialogSwitcher'
import { ITopBarIconContainer } from '../interface/ITopBarIconContainer'
import { TopBarIconRenderer } from '../topBarIcon'

const ADMIN_SETTING_ICON_PATH = new URL('../assets/adminSetting.png', import.meta.url).href

export class AdminSettingIcon extends TopBarIconRenderer {
  public constructor(
    playerRole: PlayerRole,
    private readonly switcher: IDialogSwitcher,
    dialog: IAdminSettingDialog,
    iconContainer: ITopBarIconContainer
  ) {
    super({
      activeIconImgPath: ADMIN_SETTING_ICON_PATH,
      inactiveIconImgPath: ADMIN_SETTING_ICON_PATH,
      onClick: (isActive) => {
        this.onClick(isActive)
      },
      isActive: false,
    })

    if (playerRole !== 'admin') {
      return
    }
    iconContainer.addIcon(this)
    switcher.add('adminSetting', dialog, () => {
      super.deactivate()
    })
  }

  /** buttonが押されたときの動作 */
  private onClick(isActive: boolean): void {
    if (isActive) {
      this.switcher.close()
    } else {
      this.switcher.open('adminSetting', () => {
        super.activate()
      })
    }
  }
}
