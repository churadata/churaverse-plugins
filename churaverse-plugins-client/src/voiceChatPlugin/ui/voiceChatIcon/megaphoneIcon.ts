import { IEventBus, IMainScene } from 'churaverse-engine-client'
import { ITopBarIconContainer } from '@churaverse/core-ui-plugin-client/interface/ITopBarIconContainer'
import { TopBarIconRenderer } from '@churaverse/core-ui-plugin-client/topBarIcon'
import { ToggleMegaphoneEvent } from '../../event/toggleMegaphoneEvent'
import { DomManager, domLayerSetting } from 'churaverse-engine-client'

import MEGAPHONE_ICON from '../../assets/megaphone.png'
export const MEGAPHONE_ICON_PATH = MEGAPHONE_ICON
const DISPLAY_DURATION_MS = 1500 // toast通知を表示する時間（ミリ秒）
const FADE_DURATION_MS = 300 // フェードイン・フェードアウトの時間（ミリ秒）

export class MegaphoneIcon extends TopBarIconRenderer {
  private readonly megaphoneToastElement: HTMLDivElement
  private hideTimeoutId: ReturnType<typeof setTimeout> | null = null
  private fadeTimeoutId: ReturnType<typeof setTimeout> | null = null
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
    this.megaphoneToastElement = this.createMegaphoneToastElement()
    DomManager.addDom(this.megaphoneToastElement)
    iconContainer.addIcon(this)
  }

  private createMegaphoneToastElement(): HTMLDivElement {
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
    element.style.whiteSpace = 'pre-line' // \n 改行用
    domLayerSetting(element, 'higher')
    element.style.pointerEvents = 'none'
    element.style.visibility = 'hidden'
    element.style.opacity = '0'
    element.style.transition = 'opacity 0.3s ease'
    element.setAttribute('role', 'status')
    element.setAttribute('aria-live', 'polite')
    element.setAttribute('aria-hidden', 'true')
    return element
  }

  private clearToastTimers(): void {
    if (this.hideTimeoutId !== null) {
      clearTimeout(this.hideTimeoutId)
      this.hideTimeoutId = null
    }
    if (this.fadeTimeoutId !== null) {
      clearTimeout(this.fadeTimeoutId)
      this.fadeTimeoutId = null
    }
  }

  private showMegaphoneToast(message: string): void {
    this.clearToastTimers()
    this.megaphoneToastElement.innerText = message
    this.megaphoneToastElement.style.visibility = 'visible'
    this.megaphoneToastElement.setAttribute('aria-hidden', 'false')
    // visibility を先に visible にしてから opacity を変え、transition を効かせる
    requestAnimationFrame(() => {
      this.megaphoneToastElement.style.opacity = '1'
    })
    this.hideTimeoutId = setTimeout(() => {
      this.hideMegaphoneToast()
    }, DISPLAY_DURATION_MS)
  }

  private hideMegaphoneToast(): void {
    this.megaphoneToastElement.style.opacity = '0'
    this.hideTimeoutId = null
    this.fadeTimeoutId = setTimeout(() => {
      this.megaphoneToastElement.style.visibility = 'hidden'
      this.megaphoneToastElement.setAttribute('aria-hidden', 'true')
      this.fadeTimeoutId = null
    }, FADE_DURATION_MS)
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
    this.showMegaphoneToast('メガホン機能がオンになりました\nあなたの声は離れている参加者にも聞こえます')
  }

  private deactivateMegaphone(): void {
    this.eventBus.post(new ToggleMegaphoneEvent(this.playerId, false))
    super.deactivate()
    this.showMegaphoneToast('メガホン機能がオフになりました\nあなたの声は近くの参加者にのみ聞こえます')
  }
}
