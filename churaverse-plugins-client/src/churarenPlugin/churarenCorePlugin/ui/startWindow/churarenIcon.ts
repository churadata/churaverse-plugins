import { ITopBarIconContainer } from '@churaverse/core-ui-plugin-client/interface/ITopBarIconContainer'
import { TopBarIconRenderer } from '@churaverse/core-ui-plugin-client/topBarIcon'
import { IDialogSwitcher } from '@churaverse/core-ui-plugin-client/interface/IDialogSwitcher'
import { IChurarenDialog } from '../../interface/IChurarenDialog'

import START_BUTTON_ICON_PATH from '../../assets/churarenIcon.png'

export class ChurarenIcon extends TopBarIconRenderer {
  public constructor(
    private readonly switcher: IDialogSwitcher,
    dialog: IChurarenDialog,
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
      order: 400,
    })

    iconContainer.addIcon(this)
    switcher.add('churaren', dialog, () => {
      super.deactivate()
    })
  }

  /** buttonが押されたときの動作 */
  public onClick(isActive: boolean): void {
    if (isActive) {
      this.switcher.close()
    } else {
      this.switcher.open('churaren', () => {
        super.activate()
      })
    }
  }
}
