import { ITopBarIconRenderer } from '../../coreUiPlugin/interface/IDialogIconRenderer'
import { IDialogSwitcher } from '../../coreUiPlugin/interface/IDialogSwitcher'
import { ITopBarIconContainer } from '../../coreUiPlugin/interface/ITopBarIconContainer'
import { TopBarIconRenderer } from '../../coreUiPlugin/topBarIcon'
import { IPlayerListDialog } from '../interface/IPlayerListDialog'

const PLAYER_LIST_ICON_PATH = 'src/game/plugins/playerListPlugin/assets/people.png'

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
