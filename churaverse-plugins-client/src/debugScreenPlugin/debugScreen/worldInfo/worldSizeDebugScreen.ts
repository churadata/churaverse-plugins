import { DomManager } from '../../../../interface/ui/util/domManager'
import { DebugSummaryScreenContainer } from '../debugSummaryScreenContainer'
import { IWorldSizeDebugScreen } from '../../IDebugRenderer/IWorldInfoDebugScreen'
import { Scene } from 'phaser'
import { ElementDebugScreenComponent } from '../components/ElementDebugScreenComponent'

export class WorldSizeDebugScreen implements IWorldSizeDebugScreen {
  private content: HTMLElement
  private gridSizeContent: HTMLElement
  private readonly scene: Scene

  public constructor(scene: Scene, debugSummaryScreenContainer: DebugSummaryScreenContainer) {
    this.scene = scene
    const element = 'Map data not found'
    this.content = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    this.gridSizeContent = DomManager.jsxToDom(
      ElementDebugScreenComponent({
        element,
      })
    )
    debugSummaryScreenContainer.addContent('worldInfo', this.content)
    debugSummaryScreenContainer.addContent('worldInfo', this.gridSizeContent)
  }

  public update(map: Phaser.Tilemaps.Tilemap): void {
    this.content.textContent = `Width: ${map.widthInPixels}, Height: ${map.heightInPixels}`
    this.gridSizeContent.textContent = `GridWidth: ${map.width}, GridHeight: ${map.height}`
  }

  public dump(): string {
    const dumpElementContent = this.content.textContent ?? 'undefined'
    const dumpGridContent = this.gridSizeContent.textContent ?? 'undefined'
    return `worldSize: ${dumpElementContent} ${dumpGridContent}`
  }
}
