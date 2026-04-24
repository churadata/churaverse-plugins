import { DomManager } from 'churaverse-engine-client'
import {
  DebugDetailScreenSectionId,
  IDebugDetailScreenContainer,
} from './IDebugScreenContainer/IDebugDetailScreenContainer'
import { DebugDetailScreenBoardComponent } from './components/DebugDetailScreenBoardComponent'
import { DebugDetailScreenSection } from './debugDetailScreenSection'

export class DebugDetailScreenContainer implements IDebugDetailScreenContainer {
  private readonly sections = new Map<DebugDetailScreenSectionId, DebugDetailScreenSection>()

  private readonly container: HTMLElement
  private readonly visibleDisplayStyle = 'flex'
  private _isOpen = false

  public constructor() {
    const dialogPanelElement = DomManager.addJsxDom(DebugDetailScreenBoardComponent())
    this.container = dialogPanelElement
    this.close()
  }

  /**
   * セクションを追加する
   * @param section 追加したいセクション
   */
  public addSection(section: DebugDetailScreenSection): void {
    this.sections.set(section.sectionId, section)
    this.container.appendChild(section.node)
  }

  /**
   * idで指定したセクション内に要素を追加する
   * @param sectionId 追加先のセクションのid
   * @param content 追加したい要素
   */
  public addContent(sectionId: DebugDetailScreenSectionId, content: HTMLElement): void {
    const section = this.sections.get(sectionId)
    if (section === undefined) {
      console.warn(`id: ${sectionId}のセクションがDebugDetailScreenに存在しない`)
      return
    }

    section.addContent(content)
  }

  public open(): void {
    this._isOpen = true
    this.container.style.display = this.visibleDisplayStyle
  }

  public close(): void {
    this._isOpen = false
    this.container.style.display = 'none'
  }

  public get isOpen(): boolean {
    return this._isOpen
  }
}
