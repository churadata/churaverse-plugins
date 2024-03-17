import { Section } from '../../coreUiPlugin/dialog/section'
import { DebugDetailScreenSectionId } from './IDebugScreenContainer/IDebugDetailScreenContainer'
import { PRIMARY_COLOR } from './debugSummaryScreenContainer'

export class DebugDetailScreenSection extends Section {
  /**
   * @param sectionId 識別用の名前. ユニークな文字列でなければならない
   * @param sectionLabel セクション名としてUI上に表示される文字列
   */
  public constructor(public readonly sectionId: DebugDetailScreenSectionId, sectionLabel: string) {
    super(sectionId, sectionLabel)
    this.node.style.cssText += 'row-gap: 0px'
    const chileElement = this.node.querySelector('div') as HTMLElement
    chileElement.style.cssText += `
    border-bottom: solid ${PRIMARY_COLOR} 2px;
    background-color: rgba(0, 0, 0, 0.3); /* 背景色を透明に設定 */
    color: white; /* テキストの色を白に設定 */
    `
  }
}
