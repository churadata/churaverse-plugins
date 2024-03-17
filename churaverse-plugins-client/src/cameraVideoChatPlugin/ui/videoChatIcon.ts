import { TopBarIconRenderer } from '../../coreUiPlugin/topBarIcon'
import { ITopBarIconContainer } from '../../coreUiPlugin/interface/ITopBarIconContainer'
import { IEventBus, IMainScene } from 'churaverse-engine-client'
import { TriggerVideoSendingEvent } from '../event/event'

const VIDEO_ON_ICON_PATH = 'src/game/plugins/cameraVideoChatPlugin/ui/assets/video.png'
const VIDEO_OFF_ICON_PATH = 'src/game/plugins/cameraVideoChatPlugin/ui/assets/video_off.png'

export class VideoChatIcon extends TopBarIconRenderer {
  private readonly iconDivContainer: HTMLDivElement

  public constructor(iconContainer: ITopBarIconContainer, private readonly bus: IEventBus<IMainScene>) {
    super({
      activeIconImgPath: VIDEO_ON_ICON_PATH,
      inactiveIconImgPath: VIDEO_OFF_ICON_PATH,
      onClick: (isActive: boolean) => {
        this.onClick(isActive)
      },
      isActive: false,
    })

    this.iconDivContainer = document.createElement('div')
    this.iconDivContainer.style.position = 'relative'
    this.iconDivContainer.appendChild(super.node)

    iconContainer.addIcon(this)
    super.deactivate()
  }

  /** buttonが押されたときの動作 */
  private onClick(isActive: boolean): void {
    if (isActive) {
      super.deactivate()
      this.bus.post(new TriggerVideoSendingEvent(!isActive))
    } else {
      super.activate()
      this.bus.post(new TriggerVideoSendingEvent(!isActive))
    }
  }
}