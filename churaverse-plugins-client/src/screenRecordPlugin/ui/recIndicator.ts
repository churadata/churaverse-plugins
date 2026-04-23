import { domLayerSetting } from 'churaverse-engine-client'

import REC_INDICATOR_PATH from '../assets/rec_indicator.png'

/**
 * 録画中に全プレイヤーの画面左端に表示されるインジケーター
 */
export class RecIndicator {
  private readonly imgElement: HTMLImageElement

  public constructor() {
    const img = document.createElement('img')
    img.src = REC_INDICATOR_PATH
    img.style.position = 'fixed'
    img.style.width = '65px'
    img.style.height = '40px'
    img.style.top = '70px'
    img.style.left = '100px'
    img.style.opacity = '0.9'
    img.style.transform = 'translateY(-50%)'
    img.style.display = 'none'

    domLayerSetting(img, 'higher')
    document.body.appendChild(img)

    this.imgElement = img
  }

  public show(): void {
    this.imgElement.style.display = 'block'
  }

  public hide(): void {
    this.imgElement.style.display = 'none'
  }
}
