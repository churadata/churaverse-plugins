import exitIconImage from '../assets/exit.png'
import { OwnPlayerExitEvent } from '../event/ownPlayerExitEvent'
import { IMainScene, IEventBus, domLayerSetting, DomManager } from 'churaverse-engine-client'
import { IExitConfirmAlert } from '../interface/IExitConfirmAlert'

export class ExitButton implements IExitConfirmAlert {
  public constructor(
    public eventBus: IEventBus<IMainScene>,
    public gameName: string = 'このゲーム'
  ) {
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
    const isPlayerKicked = window.confirm(this.gameName)
    if (isPlayerKicked) {
      const ownPlayerExitEvent = new OwnPlayerExitEvent()
      this.eventBus.post(ownPlayerExitEvent)
    }
  }

  public setGameOwnerExitMessage(gameName?: string): void {
    this.gameName =
      'あなたはゲームオーナーです。あなたが退出すると' + (gameName ?? this.gameName) + 'が直ちに終了します'
  }

  public setGameExitMessage(gameName?: string): void {
    this.gameName = (gameName ?? this.gameName) + 'から退出しますか？'
  }

  public resetGameExitMessage(): void {
    this.gameName = 'このミーティングから退出しますか？'
  }
}
