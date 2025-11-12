import { TopBarIconRenderer } from '@churaverse/core-ui-plugin-client/topBarIcon'
import { IDialogSwitcher } from '@churaverse/core-ui-plugin-client/interface/IDialogSwitcher'
import { IGameDialog } from '../interface/IGameDialog'
import { ITopBarIconContainer } from '@churaverse/core-ui-plugin-client/interface/ITopBarIconContainer'

import GAME_ICON_PATH from '../assets/gameIcon.png'

export class GameIcon extends TopBarIconRenderer {
  public constructor(
    private readonly switcher: IDialogSwitcher,
    dialog: IGameDialog,
    iconContainer: ITopBarIconContainer,
    iconPath: string = GAME_ICON_PATH
  ) {
    super({
      activeIconImgPath: iconPath,
      inactiveIconImgPath: iconPath,
      onClick: (isActive) => {
        this.onClick(isActive)
      },
      isActive: false,
      order: 500,
    })

    iconContainer.addIcon(this)
    switcher.add('game', dialog, () => {
      super.deactivate()
    })
  }

  public onClick(isActive: boolean): void {
    if (isActive) {
      this.switcher.close()
    } else {
      this.switcher.open('game', () => {
        super.activate()
      })
    }
  }

  public close(): void {
    this.switcher.close()
    super.deactivate()
  }
}
