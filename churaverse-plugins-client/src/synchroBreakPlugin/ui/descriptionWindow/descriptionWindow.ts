import { DomManager, domLayerSetting } from 'churaverse-engine-client'
import { DescriptionWindowComponent } from './component/DescriptionWindowComponent'
import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'

export class DescriptionWindow implements IGameUiComponent {
  public element!: HTMLElement
  public visible: boolean = true
  private descriptionText: string = ``

  public initialize(): void {
    this.element = DomManager.addJsxDom(DescriptionWindowComponent({ description: this.descriptionText }))
    domLayerSetting(this.element, 'lowest')
    this.element.innerHTML = 'シンクロブレイクゲームが開始されました！'
  }

  public open(text: string): void {
    this.element.style.display = 'flex'
    this.element.innerHTML = text
  }

  public close(): void {
    this.element.style.display = 'none'
  }

  public delete(): void {
    this.descriptionText = ''
  }

  /**
   * 説明ウィンドウの文章を更新する
   * @param text 更新する文章
   */
  public setDescriptionText(text: string): void {
    this.element.innerHTML = text
  }
}
