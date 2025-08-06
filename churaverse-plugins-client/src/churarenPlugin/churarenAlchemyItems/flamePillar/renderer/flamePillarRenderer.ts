import { Scene } from 'phaser'
import { Position, GRID_SIZE } from 'churaverse-engine-client'
import { IAlchemyItemRenderer } from '@churaverse/churaren-alchemy-plugin-client/domain/IAlchemyItemRenderer'
import flamePillarImage from '../assets/flamePillar.gif'

/**
 * 爆発のテクスチャキー
 */
const ITEM_TEXTURE_KEY_PREFIX = 'flamePillar'

/**
 * 表示時の縦横のサイズ
 */
const DISPLAY_SIZE = 50

/**
 * Item描画クラス
 */
export class FlamePillarRenderer implements IAlchemyItemRenderer {
  private readonly scene: Scene
  private readonly sprite: Phaser.GameObjects.Sprite
  private tween?: Phaser.Tweens.Tween
  private readonly textureKey: string

  public constructor(scene: Scene) {
    this.scene = scene
    this.textureKey = `${ITEM_TEXTURE_KEY_PREFIX}`
    this.sprite = scene.add
      .sprite(
        // 爆発の初期座標は画面外に設定しておく
        -100,
        -100,
        ITEM_TEXTURE_KEY_PREFIX,
        // アニメーションの番号
        0
      )
      .setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE)
  }

  // 基本アイテムのテクスチャのロード
  public static loadAssets(scene: Scene): void {
    scene.load.image(`${ITEM_TEXTURE_KEY_PREFIX}`, flamePillarImage)
  }

  public setInitPosition(pos: Position): void {
    this.sprite.x = pos.x
    this.sprite.y = pos.y
  }

  public spawn(source: Position): void {
    this.sprite.active = true
    console.log('sprite', this.sprite)
    source = source.align()
    this.sprite.x = source.x
    this.sprite.y = source.y
    this.sprite.setPosition(source.x, source.y)
    this.sprite.setVisible(true)
  }

  public chase(dest: Position, speed: number, onUpdate: (pos: Position) => void): void {
    const duration = GRID_SIZE / speed

    this.tween = this.scene.add.tween({
      targets: this.sprite,

      // X座標の移動を設定
      x: dest.x,

      // Y座標の移動を設定
      y: dest.y,

      // 通信によるラグで歩行距離が伸びた場合は移動速度が上がって調整される
      // 一定以上離れるとteleportで調整する
      duration,

      onUpdate: () => {
        onUpdate(new Position(this.sprite.x, this.sprite.y))
      },
    })
  }

  /**
   * 10秒経ったらitemを破壊する
   */
  public destroy(): void {
    this.sprite.destroy()
  }
}
