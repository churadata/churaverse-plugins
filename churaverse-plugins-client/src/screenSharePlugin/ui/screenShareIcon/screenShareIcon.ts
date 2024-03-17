import { IScreenShareSender } from '../../interface/IScreenShareSender'
import { ITopBarIconContainer } from '../../../coreUiPlugin/interface/ITopBarIconContainer'
import { TopBarIconRenderer } from '../../../coreUiPlugin/topBarIcon'

const SCREEN_SHARE_ACTIVE_ICON_PATH = 'src/game/plugins/screenSharePlugin/assets/screenshare.png'
const SCREEN_SHARE_INACTIVE_ICON_PATH = 'src/game/plugins/screenSharePlugin/assets/screenshare_off.png'

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
