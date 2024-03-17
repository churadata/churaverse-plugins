import { DomManager } from '../../../../interface/ui/util/domManager'
import { DebugSummaryScreenContainer } from '../debugSummaryScreenContainer'
import { IWorldFrontendVersionDebugScreen } from '../../IDebugRenderer/IWorldInfoDebugScreen'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'

export class WorldFrontendVersionDebugScreen implements IWorldFrontendVersionDebugScreen {
  private content: HTMLElement

  public constructor(debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    const element =
      `Frontend Version: ${import.meta.env.VITE_FRONT_VERSION}` ?? 'Frontend Version: Versionの取得ができませんでした。'
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    debugSummaryScreenContainer.addContent('worldInfo', this.content)
  }

  public update(): void {
    const worldElement =
      `Frontend Version: ${import.meta.env.VITE_FRONT_VERSION}` ?? 'Frontend Version: Versionの取得ができませんでした。'
    this.content.textContent = `${worldElement}`
  }

  public dump(): string {
    const innerHTML = this.content.innerHTML
    const match = /Frontend Version: (\S+)/.exec(innerHTML)

    if (match !== null) {
      return match[1]
    } else {
      return 'undefined'
    }
  }
}
