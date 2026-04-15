import { IEventBus, IMainScene } from 'churaverse-engine-client'
import { ITopBarIconContainer } from '@churaverse/core-ui-plugin-client/interface/ITopBarIconContainer'
import { TopBarIconRenderer } from '@churaverse/core-ui-plugin-client/topBarIcon'
import { ToggleMegaphoneEvent } from '../../event/toggleMegaphoneEvent'

import MEGAPHONE_ICON from '../../assets/megaphone.png'
export const MEGAPHONE_ICON_PATH = MEGAPHONE_ICON
const DISPLAY_DURATION = 1500 // toast通知を表示する時間（ミリ秒）

export class MegaphoneIcon extends TopBarIconRenderer {
  private readonly megaphoneDialogElement: HTMLDivElement
  private hideTimeoutId: ReturnType<typeof setTimeout> | null = null
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
    this.imgElement.title =
      'Megaphone:\nこの機能をオンにすると、あなたの声はこの場にいるすべての人に聞こえるようになります'
    this.megaphoneDialogElement = this.createMegaphoneDialogElement()
    document.body.appendChild(this.megaphoneDialogElement)
    iconContainer.addIcon(this)
  }
  private createMegaphoneDialogElement(): HTMLDivElement {
    const element = document.createElement('div')
    element.style.position = 'fixed'
    element.style.top = '80px'
    element.style.left = '50%'
    element.style.transform = 'translateX(-50%)'
    element.style.padding = '10px 20px'
    element.style.borderRadius = '8px'
    element.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
    element.style.color = '#fff'
    element.style.fontSize = '14px'
    element.style.lineHeight = '1.6'
    element.style.textAlign = 'center'
    element.style.zIndex = '10000'
    element.style.pointerEvents = 'none'
    element.style.opacity = '0'
    element.style.transition = 'opacity 0.3s ease'
    return element
  }
  private showMegaphoneDialog(message: string): void {
    if (this.hideTimeoutId !== null) {
      clearTimeout(this.hideTimeoutId)
    }
    this.megaphoneDialogElement.innerText = message
    this.megaphoneDialogElement.style.opacity = '1'
    this.hideTimeoutId = setTimeout(() => {
      this.megaphoneDialogElement.style.opacity = '0'
      this.hideTimeoutId = null
    }, DISPLAY_DURATION)
  }
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
    this.showMegaphoneDialog('メガホン機能がオンになりました\nあなたの声は離れている参加者にも聞こえます')
  }
  private deactivateMegaphone(): void {
    this.eventBus.post(new ToggleMegaphoneEvent(this.playerId, false))
    super.deactivate()
    this.showMegaphoneDialog('メガホン機能がオフになりました\nあなたの声は近くの参加者にのみ聞こえます')
  }
}