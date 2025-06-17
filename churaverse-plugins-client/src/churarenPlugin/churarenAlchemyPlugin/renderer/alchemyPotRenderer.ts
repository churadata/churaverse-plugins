import { Scene } from 'phaser'
import AlchemyImage from '../assets/alchemyPot.png'
import { layerSetting, Position } from 'churaverse-engine-client'
import { IAlchemyPotRenderer } from '../domain/IAlchemyPotRenderer'

/**
 * alchemyのテクスチャーキー
 */
const ALCHEMY_TEXTURE_KEY = 'alchemy'

/**
 * 表示時の縦横のサイズ
 */
const DISPLAY_SIZE = 70

/**
 * Alchemy描画クラス
 */
export class AlchemyPotRenderer implements IAlchemyPotRenderer {
  private readonly scene: Scene
  private readonly image: Phaser.GameObjects.Image

  public constructor(scene: Scene) {
    this.scene = scene

    this.image = scene.add
      .image(
        // 画面外に配置
        -100,
        -100,
        ALCHEMY_TEXTURE_KEY,
        0
      )
      .setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE)

    layerSetting(this.image, 'player', 10)
  }

  public static loadAssets(scene: Scene): void {
    scene.load.image(ALCHEMY_TEXTURE_KEY, AlchemyImage)
  }

  public spawn(source: Position): void {
    this.image.active = true
    this.image.setPosition(source.x, source.y)
    this.image.setVisible(true)
  }

  public destroy(): void {
    this.image.destroy()
  }
}
