import { DomManager } from '../../../../interface/ui/util/domManager'
import { DebugDetailScreenContainer } from '../debugDetailScreenContainer'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'
import { ICollisionCountDebugDetailScreen } from '../../IDebugRenderer/IMapInfoDebugDetailScreen'
import { MapManager } from '../../../../interface/map/mapManager'

export class CollisionCountCountDebugDetailScreen implements ICollisionCountDebugDetailScreen {
  private content: HTMLElement

  public constructor(debugDetailScreenContainer: DebugDetailScreenContainer, mapManager: MapManager) {
    const collision = mapManager.maps.get('Collision')?.getLayerCellCount('Collision') ?? 'undefine'
    const element = `CollisionCount: ${collision}`
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    debugDetailScreenContainer.addContent('mapInfo', this.content)
  }

  public update(collision: number | undefined): void {
    this.content.textContent = `CollisionCount: ${collision ?? 'undefined'}`
  }

  public dump(): string {
    const innerHTML = this.content.innerHTML
    const match = /CollisionCount: (\S+)/.exec(innerHTML)

    if (match !== null) {
      return match[1]
    } else {
      return 'undefined'
    }
  }
}
