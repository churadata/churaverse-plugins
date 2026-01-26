import { IScreenShareSender } from '../../interface/IScreenShareSender'
import { ITopBarIconContainer } from '@churaverse/core-ui-plugin-client/interface/ITopBarIconContainer'
import { TopBarIconRenderer } from '@churaverse/core-ui-plugin-client/topBarIcon'

import SCREEN_SHARE_ACTIVE_ICON_PATH from '../../assets/screenshare.png'
import SCREEN_SHARE_INACTIVE_ICON_PATH from '../../assets/screenshare_off.png'

export class ScreenShareIcon extends TopBarIconRenderer {
  public constructor(iconContainer: ITopBarIconContainer, private readonly screenShareSender: IScreenShareSender) {
    super({
      activeIconImgPath: SCREEN_SHARE_ACTIVE_ICON_PATH,
      inactiveIconImgPath: SCREEN_SHARE_INACTIVE_ICON_PATH,
      onClick: (isActive) => {
        this.onClick(isActive)
      },
      isActive: false,
      order: 100,
    })

    iconContainer.addIcon(this)
  }

  /** buttonが押されたときの動作 */
  private onClick(isActive: boolean): void {
    if (isActive) {
      void this.tryStopScreenShare()
    } else {
      void this.tryStartScreenShare()
    }
  }

  /**
   * 画面共有を開始する
   */
  private async tryStartScreenShare(): Promise<void> {
    await this.screenShareSender.startStream()
  }

  /**
   * 画面共有を停止する
   */
  private async tryStopScreenShare(): Promise<void> {
    await this.screenShareSender.stopStream()
  }
}
