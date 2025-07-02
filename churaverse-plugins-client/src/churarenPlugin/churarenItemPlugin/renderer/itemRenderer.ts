import { Scene } from 'phaser'
import { IItemRenderer } from '../domain/IItemRenderer'
import { ItemKind } from '../domain/itemKind'
import { GRID_SIZE, Position } from 'churaverse-engine-client'
import fireOreImage from '../assets/fireOre.png'
import waterOreImage from '../assets/waterOre.png'
import grassOreImage from '../assets/grassOre.png'
import herbImage from '../assets/herb.png'
/**
 * アイテムのテクスチャーキー
 */
const ITEM_TEXTURE_KEY_PREFIX = 'materialItem'

/**
 * 表示時の縦横のサイズ
 */
const DISPLAY_SIZE = 40

/**
 * Item描画クラス
 */
export class ItemRenderer implements IItemRenderer {
  private readonly scene: Scene
  private readonly image: Phaser.GameObjects.Image
  private tween?: Phaser.Tweens.Tween
  private readonly textureKey: string

  public constructor(scene: Scene, kind: ItemKind) {
    this.scene = scene
    this.textureKey = `${ITEM_TEXTURE_KEY_PREFIX}_${kind}`

    this.image = scene.add
      .image(
        // アイテムの初期生成位置
        800,
        440,
        this.textureKey,
        0
      )
      .setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE)
  }

  // 基本アイテムのテクスチャのロード
  public static loadAssets(scene: Scene): void {
    scene.load.image(`${ITEM_TEXTURE_KEY_PREFIX}_fireOre`, fireOreImage)
    scene.load.image(`${ITEM_TEXTURE_KEY_PREFIX}_waterOre`, waterOreImage)
    scene.load.image(`${ITEM_TEXTURE_KEY_PREFIX}_grassOre`, grassOreImage)
    scene.load.image(`${ITEM_TEXTURE_KEY_PREFIX}_herb`, herbImage)
  }

  public spawn(source: Position): void {
    this.image.active = true
    source = source.align()
    this.image.x = source.x
    this.image.y = source.y
    this.image.setPosition(source.x, source.y)
    this.image.setVisible(true)
  }

  public chase(dest: Position, speed: number, onUpdate: (pos: Position) => void): void {
    const duration = GRID_SIZE / speed

    this.tween = this.scene.add.tween({
      targets: this.image,
      x: dest.x,
      y: dest.y,

      // 通信によるラグで歩行距離が伸びた場合は移動速度が上がって調整される
      // 一定以上離れるとteleportで調整する
      duration,

      onUpdate: () => {
        onUpdate(new Position(this.image.x, this.image.y))
      },
    })
  }

  /**
   * 10秒経ったらitemを破壊する
   */
  public destroy(): void {
    this.image.destroy()
  }
}
