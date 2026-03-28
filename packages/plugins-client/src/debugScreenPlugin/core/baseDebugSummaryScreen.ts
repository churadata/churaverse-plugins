import { DomManager } from 'churaverse-engine-client'
import { DebugScreenSectionId } from '../debugScreen/IDebugScreenContainer/IDebugSummaryScreenContainer'
import { ElementDebugScreenComponent } from '../debugScreen/components/ElementDebugScreenComponent'
import { DebugSummaryScreenContainer } from '../debugScreen/debugSummaryScreenContainer'

export abstract class BaseDebugSummaryScreen {
  protected readonly content: HTMLElement
  public constructor(
    debugSummaryScreenContainer: DebugSummaryScreenContainer,
    sectionName: DebugScreenSectionId,
    element: string
  ) {
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    debugSummaryScreenContainer.addContent(sectionName, this.content)
  }
}
