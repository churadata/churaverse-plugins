import { domLayerSetting, DomManager } from 'churaverse-engine-client'
import { IRecordingIndicator } from '../interface/IRecordingIndicator'
import recIndicatorImage from './assets/rec_indicator.png'

export class RecordingIndicator implements IRecordingIndicator {
  private readonly image: HTMLImageElement
  public constructor() {
    this.image = document.createElement('img')
    this.image.style.width = '80px'
    this.image.style.height = '40px'
    this.image.style.top = '50px'
    // 退出ボタンの右に表示
    this.image.style.left = '100px'
    this.image.src = recIndicatorImage

    DomManager.addDom(this.image)
    domLayerSetting(this.image, 'higher')
    this.image.style.display = 'none'
  }

  public show(): void {
    this.image.style.display = 'block'
  }

  public hide(): void {
    this.image.style.display = 'none'
  }
}
