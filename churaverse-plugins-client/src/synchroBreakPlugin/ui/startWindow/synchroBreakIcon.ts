import { ITopBarIconContainer } from '@churaverse/core-ui-plugin-client/interface/ITopBarIconContainer'
import { TopBarIconRenderer } from '@churaverse/core-ui-plugin-client/topBarIcon'
import { IDialogSwitcher } from '@churaverse/core-ui-plugin-client/interface/IDialogSwitcher'
import { ISynchroBreakDialog } from '../../interface/ISynchroBreakDialog'

import START_BUTTON_ICON_PATH from '../../assets/synchroBreakIcon.png'

export class SynchroBreakIcon extends TopBarIconRenderer {
  public constructor(
    private readonly switcher: IDialogSwitcher,
    dialog: ISynchroBreakDialog,
    iconContainer: ITopBarIconContainer,
    iconPath: string = START_BUTTON_ICON_PATH
  ) {
    super({
      activeIconImgPath: iconPath,
      inactiveIconImgPath: iconPath,
      onClick: (isActive) => {
        this.onClick(isActive)
      },
      isActive: false,
      order: 300,
    })

    iconContainer.addIcon(this)
    switcher.add('synchroBreak', dialog, () => {
      super.deactivate()
    })
  }

  /** buttonが押されたときの動作 */
  public onClick(isActive: boolean): void {
    if (isActive) {
      this.switcher.close()
    } else {
      this.switcher.open('synchroBreak', () => {
        super.activate()
      })
    }
  }
}
