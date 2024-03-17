import { DomManager } from '../../../../interface/ui/util/domManager'
import { DebugDetailScreenContainer } from '../debugDetailScreenContainer'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'
import { ICollisionCountDebugDetailScreen } from '../../IDebugRenderer/IMapInfoDebugDetailScreen'
import { MapManager } from '../../../../interface/map/mapManager'

export class SpawnCountCountDebugDetailScreen implements ICollisionCountDebugDetailScreen {
  private content: HTMLElement

  public constructor(debugDetailScreenContainer: DebugDetailScreenContainer, mapManager: MapManager) {
    const collision = mapManager.maps.get('Collision')?.getLayerCellCount('Collision') ?? 'undefine'
    const element = `SpawnCount: ${collision}`
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    debugDetailScreenContainer.addContent('mapInfo', this.content)
  }

  public update(spawn: number | undefined): void {
    this.content.textContent = `SpawnCount: ${spawn ?? 'undefined'}`
  }

  public dump(): string {
    const innerHTML = this.content.innerHTML
    const match = /SpawnCount: (\S+)/.exec(innerHTML)

    if (match !== null) {
      return match[1]
    } else {
      return 'undefined'
    }
  }
}
