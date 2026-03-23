import { IEventBus, IMainScene } from 'churaverse-engine-client'
import { ITopBarIconContainer } from '@churaverse/core-ui-plugin-client/interface/ITopBarIconContainer'
import { TopBarIconRenderer } from '@churaverse/core-ui-plugin-client/topBarIcon'
import { ToggleMegaphoneEvent } from '../../event/toggleMegaphoneEvent'

import MEGAPHONE_ICON from '../../assets/megaphone.png'
export const MEGAPHONE_ICON_PATH = MEGAPHONE_ICON

// メガホンの状態を数秒間表示するためのクラス
const MEGAPHONE_DIALOG_CLASS = 'megaphone-dialog'

// スタイルを定義
const styleEl = document.createElement('style')
styleEl.textContent = `
  .${MEGAPHONE_DIALOG_CLASS} {
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    font-size: 14px;
    line-height: 1.6;
    text-align: center;
    z-index: 10000;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
`
document.head.appendChild(styleEl)

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
    dialog.className = MEGAPHONE_DIALOG_CLASS
    dialog.innerText = message

    dialog.style.opacity = '1'

    document.body.appendChild(dialog)

    setTimeout(() => {
      dialog.remove()
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
