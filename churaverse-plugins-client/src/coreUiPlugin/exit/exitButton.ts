import exitIconImage from '../assets/exit.png'
import { OwnPlayerExitEvent } from '../event/ownPlayerExitEvent'
import { IMainScene, IEventBus, domLayerSetting, DomManager } from 'churaverse-engine-client'

export class ExitButton {
  public constructor(private readonly eventBus: IEventBus<IMainScene>) {
    // 退出ボタンの位置･見た目設定
    const img = document.createElement('img')
    img.style.opacity = '0.5'
    img.style.width = '40px'
    img.style.height = '40px'
    img.style.top = '50px'
    img.style.left = '50px'
    img.src = exitIconImage

    img.addEventListener('click', () => {
      this.onClick()
    })

    domLayerSetting(img, 'higher')

    DomManager.addDom(img)
  }

  /** buttonが押されたときの動作 */
  private onClick(): void {
    const isPlayerKicked = window.confirm('ミーティングから退出しますか？')
    if (isPlayerKicked) {
      const ownPlayerExitEvent = new OwnPlayerExitEvent()
      this.eventBus.post(ownPlayerExitEvent)
    }
  }
}
