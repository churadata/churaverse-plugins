import { IEventBus, DomManager, IMainScene } from 'churaverse-engine-client'
import {
  DebugScreenSectionId,
  IDebugSummaryScreenContainer,
} from './IDebugScreenContainer/IDebugSummaryScreenContainer'
import { DebugScreenBoardComponent } from './components/DebugScreenBoardComponent'
import { DebugScreenDumpButton } from './debugScreenDumpButton'
import { DebugSummaryScreenSection } from './debugSummaryScreenSection'

/** メインカラー */
export const PRIMARY_COLOR = 'lightsteelblue'

export class DebugSummaryScreenContainer implements IDebugSummaryScreenContainer {
  private readonly sections = new Map<DebugScreenSectionId, DebugSummaryScreenSection>()

  private readonly container: HTMLElement
  private readonly visibleDisplayStyle = 'flex'
  private _isOpen = false

  public constructor(eventBus: IEventBus<IMainScene>) {
    const dialogPanelElement = DomManager.addJsxDom(DebugScreenBoardComponent())
    this.container = dialogPanelElement
    const dumpButton = new DebugScreenDumpButton(eventBus)
    this.container.appendChild(dumpButton.buttonElement)
    this.close()
  }

  /**
   * セクションを追加する
   * @param section 追加したいセクション
   */
  public addSection(section: DebugSummaryScreenSection): void {
    this.sections.set(section.sectionId, section)
    this.container.appendChild(section.node)
  }

  /**
   * idで指定したセクション内に要素を追加する
   * @param sectionId 追加先のセクションのid
   * @param content 追加したい要素
   */
  public addContent(sectionId: DebugScreenSectionId, content: HTMLElement): void {
    const section = this.sections.get(sectionId)
    if (section === undefined) {
      console.warn(`id: ${sectionId}のセクションがDebugSummaryScreenに存在しない`)
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
