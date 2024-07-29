import { ITopBarIconRenderer } from '@churaverse/core-ui-plugin-client/interface/IDialogIconRenderer'
import { IDialogSwitcher } from '@churaverse/core-ui-plugin-client/interface/IDialogSwitcher'
import { ITopBarIconContainer } from '@churaverse/core-ui-plugin-client/interface/ITopBarIconContainer'
import { TopBarIconRenderer } from '@churaverse/core-ui-plugin-client/topBarIcon'
import { IPlayerListDialog } from '../interface/IPlayerListDialog'

import PLAYER_LIST_ICON_PATH from '../assets/people.png'

export class PlayerListIcon extends TopBarIconRenderer implements ITopBarIconRenderer {
  public constructor(
    private readonly switcher: IDialogSwitcher,
    dialog: IPlayerListDialog,
    iconContainer: ITopBarIconContainer
  ) {
    super({
      activeIconImgPath: PLAYER_LIST_ICON_PATH,
      inactiveIconImgPath: PLAYER_LIST_ICON_PATH,
      onClick: (isActive) => {
        this.onClick(isActive)
      },
      isActive: false,
    })

    iconContainer.addIcon(this)

    switcher.add('playerList', dialog, () => {
      super.deactivate()
    })
  }

  /** buttonが押されたときの動作 */
  private onClick(isActive: boolean): void {
    if (isActive) {
      this.switcher.close()
    } else {
      this.switcher.open('playerList', () => {
        super.activate()
      })
    }
  }
}
