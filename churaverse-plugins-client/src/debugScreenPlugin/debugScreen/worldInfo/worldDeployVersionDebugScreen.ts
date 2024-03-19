import { DomManager } from 'churaverse-engine-client'
import { DebugSummaryScreenContainer } from '../debugSummaryScreenContainer'
import { IWorldDeployVersionDebugScreen } from '../../IDebugRenderer/IWorldInfoDebugScreen'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'

export class WorldDeployVersionDebugScreen implements IWorldDeployVersionDebugScreen {
  private readonly content: HTMLElement

  public constructor(debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    const element =
      `Deploy Version: ${import.meta.env.VITE_DEPLOY_VERSION}` ?? 'Deploy Version: Versionの取得ができませんでした。'
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    debugSummaryScreenContainer.addContent('worldInfo', this.content)
  }

  public update(): void {
    const worldElement =
      `Deploy Version: ${import.meta.env.VITE_DEPLOY_VERSION}` ?? 'Deploy Version: Versionの取得ができませんでした。'
    this.content.textContent = `${worldElement}`
  }

  public dump(): string {
    const innerHTML = this.content.innerHTML
    const match = /Deploy Version: (\S+)/.exec(innerHTML)

    if (match !== null) {
      return match[1]
    } else {
      return 'undefined'
    }
  }
}
