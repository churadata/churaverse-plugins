import { DomManager } from '../../../../interface/ui/util/domManager'
import { DebugDetailScreenContainer } from '../debugDetailScreenContainer'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'
import { IMegaphoneMyStatusDebugDetailScreen } from '../../IDebugRenderer/IMegaphoneInfoDebugDetailScreen'

export class MegaphoneStatusDebugDetailScreen implements IMegaphoneMyStatusDebugDetailScreen {
  private content: HTMLElement

  public constructor(debugDetailScreenContainer: DebugDetailScreenContainer) {
    const isOn = 'false'
    const element = `IsOn: ${isOn}`
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    debugDetailScreenContainer.addContent('megaphoneInfo', this.content)
  }

  public update(isOn: boolean): void {
    this.content.textContent = `IsOn: ${String(isOn)}`
  }

  public dump(): string {
    const innerHTML = this.content.innerHTML
    const match = /IsOn: (\S+)/.exec(innerHTML)

    if (match !== null) {
      return match[1]
    } else {
      return 'undefined'
    }
  }
}
