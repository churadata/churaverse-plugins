import { IEventBus, IMainScene } from 'churaverse-engine-client'
import { ITopBarIconContainer } from '@churaverse/core-ui-plugin-client/interface/ITopBarIconContainer'
import { TopBarIconRenderer } from '@churaverse/core-ui-plugin-client/topBarIcon'
import { ToggleMegaphoneEvent } from '../../event/toggleMegaphoneEvent'

import MEGAPHONE_ICON from '../../assets/megaphone.png'
export const MEGAPHONE_ICON_PATH = MEGAPHONE_ICON

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

    this.imgElement.title ='Megaphone:\nこの機能をオンにすると、あなたの声はこの場にいるすべての人に聞こえるようになります'
    
    iconContainer.addIcon(this)
  }

  /** メガホン状態を画面に数秒だけ表示する */
  private showMegaphoneDialog(message: string): void {
    const dialog = document.createElement('div')
    dialog.innerHTML = message.replace(/\n/g, '<br>')

    Object.assign(dialog.style, {
      position: 'fixed',
      top: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '10px 20px',
      borderRadius: '8px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
      fontSize: '14px',
      lineHeight: '1.6',
      textAlign: 'center',
      zIndex: '10000',
      pointerEvents: 'none',
      opacity: '0',
      transition: 'opacity 0.3s ease',
    } as Partial<CSSStyleDeclaration>)

    document.body.appendChild(dialog)

    // 次のフレームでフェードイン
    requestAnimationFrame(() => {
      dialog.style.opacity = '1'
    })

    // 1.5秒後にフェードアウト → 削除
    setTimeout(() => {
      dialog.style.opacity = '0'
      setTimeout(() => {
        dialog.remove()
      }, 300)
    }, 1500)
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
    this.showMegaphoneDialog('メガホン機能がオンになりました\nあなたの声は離れている参加者にも聞こえます')
  }

  private deactivateMegaphone(): void {
    this.eventBus.post(new ToggleMegaphoneEvent(this.playerId, false))
    super.deactivate()
    this.showMegaphoneDialog('メガホン機能がオフになりました\nあなたの声は近くの参加者にのみ聞こえます')
  }
}
