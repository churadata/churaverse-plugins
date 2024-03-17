import { GameObjects, Scene } from 'phaser'
import { ITitlePlayerBackgroundContainerRenderer } from '../../domain/ITitlePlayerBackgroundContainerRenderer'
import { createUIContainer } from 'churaverse-engine-client'

/*
 * Player Renderer を描画するには背景として Tilemaps.TilemapLayer を用意する必要がある
 */
export class TitlePlayerBackgroundContainerRenderer implements ITitlePlayerBackgroundContainerRenderer {
  public container: GameObjects.Container

  public constructor(public scene: Scene) {
    this.container = createUIContainer(scene, 0.5, 0.5, -5)
  }
}
