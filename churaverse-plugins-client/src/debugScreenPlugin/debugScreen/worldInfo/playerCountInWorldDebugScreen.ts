import { DomManager } from 'churaverse-engine-client'
import { DebugSummaryScreenContainer } from '../debugSummaryScreenContainer'
import { IPlayerCountInWorld } from '../../IDebugRenderer/IWorldInfoDebugScreen'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'

export class PlayerCountInWorld implements IPlayerCountInWorld {
  private content: HTMLElement

  public constructor(debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    const element = `PlayerCount: undefined`
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    debugSummaryScreenContainer.addContent('worldInfo', this.content)
  }

  public update(playerCount: number): void {
    this.content.textContent = `PlayerCount: ${playerCount}`
  }

  public dump(): string {
    const innerHTML = this.content.innerHTML
    const match = /PlayerCount: (\S+)/.exec(innerHTML)

    if (match !== null) {
      return match[1]
    } else {
      return 'undefined'
    }
  }
}
