import { TopBarIconRenderer } from '@churaverse/core-ui-plugin-client/topBarIcon'
import { IDialogSwitcher, DialogType } from '@churaverse/core-ui-plugin-client/interface/IDialogSwitcher'
import { ITopBarIconContainer } from '@churaverse/core-ui-plugin-client/interface/ITopBarIconContainer'

export class GameButtonUi extends TopBarIconRenderer {
  private readonly switcher: IDialogSwitcher
  private readonly dialogId: DialogType

  public constructor(
    switcher: IDialogSwitcher,
    iconContainer: ITopBarIconContainer,
    iconPath: string,
    dialogId: DialogType
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
    this.switcher = switcher
    this.dialogId = dialogId
  }

  // ダイアログアイコンが押された時の動作
  protected onClick(isActive: boolean): void {
    if (isActive) {
      this.switcher.close()
    } else {
      this.switcher.open(this.dialogId, () => {
        super.activate()
      })
    }
  }
}
