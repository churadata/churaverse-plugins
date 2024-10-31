import { DomManager, domLayerSetting } from 'churaverse-engine-client'
import { DescriptionWindowComponent } from './component/DescriptionWindowComponent'

export class DescriptionWindow {
  private readonly descriptionWindow: HTMLElement
  private readonly descriptionText: string = ``

  public constructor() {
    this.descriptionWindow = DomManager.addJsxDom(DescriptionWindowComponent({ description: this.descriptionText }))
    domLayerSetting(this.descriptionWindow, 'lowest')
    this.close()
  }

  public open(text: string): void {
    this.descriptionWindow.style.display = 'flex'
    this.descriptionWindow.innerHTML = text
  }

  public close(): void {
    this.descriptionWindow.style.display = 'none'
  }

  public remove(): void {
    this.descriptionWindow.remove()
  }

  public setDescriptionText(text: string): void {
    this.descriptionWindow.innerHTML = text
  }
}

declare module '../uiManager' {
  export interface GameUiMap {
    description: DescriptionWindow
  }
}
