import { IEventBus,IMainScene } from 'churaverse-engine-client'
import { ITopBarIconContainer } from '@churaverse/core-ui-plugin-client/interface/ITopBarIconContainer'
import { TopBarIconRenderer } from '@churaverse/core-ui-plugin-client/topBarIcon'
import { ToggleMegaphoneEvent } from '../../event/toggleMegaphoneEvent'

export const MEGAPHONE_ICON_PATH = new URL('../../assets/megaphone.png', import.meta.url).href

export class MegaphoneIcon extends TopBarIconRenderer {
  public constructor(
    private readonly eventBus: IEventBus<IMainScene>,
    iconContainer: ITopBarIconContainer,
    private readonly playerId: string
  ) {
    super({
      activeIconImgPath: MEGAPHONE_ICON_PATH,
      inactiveIconImgPath: MEGAPHONE_ICON_PATH,
      onClick: (isActive) => {
        this.onClick(isActive)
      },
      isActive: true,
      order: 250,
    })

    iconContainer.addIcon(this)
  }

  /** buttonが押されたときの動作 */
  private onClick(isActive: boolean): void {
    if (isActive) {
      this.deactivateMegaphone()
    } else {
      this.activateMegaphone()
    }
  }

  private activateMegaphone(): void {
    this.eventBus.post(new ToggleMegaphoneEvent(this.playerId, true))
    super.activate()
  }

  private deactivateMegaphone(): void {
    this.eventBus.post(new ToggleMegaphoneEvent(this.playerId, false))
    super.deactivate()
  }
}
