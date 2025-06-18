import { DomManager, domLayerSetting } from 'churaverse-engine-client'
import { DescriptionWindowComponent } from './component/DescriptionWindowComponent'
import '@churaverse/game-plugin-client/gameUiManager'
import { IDescriptionWindow } from '../../interface/IDescriptionWindow'

export class DescriptionWindow implements IDescriptionWindow {
  public element!: HTMLElement
  public visible: boolean = false
  private descriptionText: string = ''

  public initialize(): void {
    this.element = DomManager.addJsxDom(DescriptionWindowComponent({ description: this.descriptionText }))
    domLayerSetting(this.element, 'lowest')
  }

  public open(text: string): void {
    this.element.style.display = 'flex'
    this.element.innerHTML = text
  }

  public remove(): void {
    this.descriptionText = ''
  }

  public close(): void {
    this.element.style.display = 'none'
  }

  /**
   * 説明ウィンドウの文章を更新する
   * @param text 更新する文章
   */
  public setDescriptionText(text: string): void {
    this.element.innerHTML = text
  }
}
