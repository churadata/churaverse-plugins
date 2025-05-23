import { TopBarIconRenderer } from '@churaverse/core-ui-plugin-client/topBarIcon'
import { ITopBarIconContainer } from '@churaverse/core-ui-plugin-client/interface/ITopBarIconContainer'
import { IEventBus, IMainScene } from 'churaverse-engine-client'
import { TriggerVideoSendingEvent } from '../event/event'

import VIDEO_ON_ICON_PATH from './assets/video.png'
import VIDEO_OFF_ICON_PATH from './assets/video_off.png'

export class VideoChatIcon extends TopBarIconRenderer {
  private readonly iconDivContainer: HTMLDivElement

  public constructor(
    iconContainer: ITopBarIconContainer,
    private readonly bus: IEventBus<IMainScene>
  ) {
    super({
      activeIconImgPath: VIDEO_ON_ICON_PATH,
      inactiveIconImgPath: VIDEO_OFF_ICON_PATH,
      onClick: (isActive: boolean) => {
        this.onClick(isActive)
      },
      isActive: false,
      // mic icon の右に配置したい。mic icon の order は 200のためそれよりも小さい値として150を設定した。
      order: 150,
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
