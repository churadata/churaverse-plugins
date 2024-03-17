import { DebugDetailScreenContainer } from '../debugScreen/debugDetailScreenContainer'
import { DomManager } from 'churaverse-engine-client'
import { ElementDebugScreenComponent } from '../debugScreen/components/ElementDebugScreenComponent'
import { DebugDetailScreenSectionId } from '../debugScreen/IDebugScreenContainer/IDebugDetailScreenContainer'

export abstract class BaseDebugDetailScreen {
  protected readonly content: HTMLElement
  public constructor(
    debugDetailScreenContainer: DebugDetailScreenContainer,
    sectionName: DebugDetailScreenSectionId,
    element: string
  ) {
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    debugDetailScreenContainer.addContent(sectionName, this.content)
  }
}
