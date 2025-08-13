import { Position, GRID_SIZE } from 'churaverse-engine-client'
import { Scene } from 'phaser'
import { IWaterRingAttackRenderer } from '../domain/IWaterRingAttackRenderer'
import waterRingAttackImage from '../assets/waterRingAttack.png'

/**
 * 水の輪のテクスチャキー
 */
const WATER_RING_ATTACK_TEXTURE_KEY = 'waterRingAttack'

/**
 * 水の輪のアニメーションキー
 */
const WATER_RING_ATTACK_ANIM_KEY = 'waterRingAttackAnimation'

/**
 * 表示時の縦横のサイズ
 */
const DISPLAY_SIZE = 200

/**
 * アニメーションの設定配列
 * オブジェクトリテラルに
 */
const _anims: Array<{ key: string; frameStart: number; frameEnd: number }> = [
  { key: 'water_ring_attack', frameStart: 0, frameEnd: 3 },
]

export class WaterRingAttackRenderer implements IWaterRingAttackRenderer {
  private readonly scene: Scene
  private readonly sprite: Phaser.GameObjects.Sprite
  private tween?: Phaser.Tweens.Tween
  private readonly textureKey: string

  public constructor(scene: Scene) {
    this.scene = scene
    this.textureKey = `${WATER_RING_ATTACK_TEXTURE_KEY}`

    // スプライトシートからスプライトを作成
    this.sprite = scene.add
      .sprite(
        -100, // 初期のx位置（画面外）
        -100, // 初期のy位置（画面外）
        WATER_RING_ATTACK_TEXTURE_KEY,
        0 // 初期フレーム
      )
      .setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE)

    // アニメーションを設定
    scene.anims.create({
      key: _anims[0].key,
      frames: this.scene.anims.generateFrameNumbers(WATER_RING_ATTACK_ANIM_KEY, {
        start: _anims[0].frameStart,
        end: _anims[0].frameEnd,
      }),
      frameRate: 10, // フレームレートを調整
      repeat: -1, // 無限に繰り返す
    })
  }

  // 基本アイテムのテクスチャのロード
  public static loadAssets(scene: Scene): void {
    // スプライトシートをロード
    scene.load.spritesheet(WATER_RING_ATTACK_TEXTURE_KEY, waterRingAttackImage, {
      frameWidth: 90, // フレームの幅
      frameHeight: 90, // フレームの高さ
    })
  }

  public spawn(source: Position): void {
    this.sprite.active = true
    source = source.align()
    this.sprite.setPosition(source.x, source.y)
    this.sprite.setVisible(true)

    // スプライトが生成されたときにアニメーションを再生
    this.sprite.play(WATER_RING_ATTACK_ANIM_KEY)
  }

  public chase(dest: Position, speed: number, onUpdate: (pos: Position) => void): void {
    const duration = GRID_SIZE / speed

    this.tween = this.scene.add.tween({
      targets: this.sprite,
      x: dest.x,
      y: dest.y,
      duration,
      onUpdate: () => {
        onUpdate(new Position(this.sprite.x, this.sprite.y))
      },
    })
  }

  public dead(): void {
    this.sprite.setVisible(false)
    this.sprite.destroy()
  }
}
