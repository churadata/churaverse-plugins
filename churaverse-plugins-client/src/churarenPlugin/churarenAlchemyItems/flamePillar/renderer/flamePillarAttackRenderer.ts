import { IFlamePillarAttackRenderer } from '../domain/IFlamePillarAttackRenderer'
import { Scene } from 'phaser'
import { Position } from 'churaverse-engine-client'
import flamePillarAttackImage from '../assets/flamePillarAttack.png'

/**
 * テクスチャキー
 */
const FLAME_PILLAR_ATTACK_TEXTURE_KEY = 'flamePillarAttack'

/**
 * 表示時の縦横のサイズ
 */
const DISPLAY_SIZE = 70

export class FlamePillarAttackRenderer implements IFlamePillarAttackRenderer {
  private readonly scene: Scene
  private readonly sprite: Phaser.GameObjects.Sprite

  public constructor(scene: Scene) {
    this.scene = scene
    this.sprite = scene.add
      .sprite(-100, -100, FLAME_PILLAR_ATTACK_TEXTURE_KEY, 0)
      .setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE)

    this.createAnimation() // アニメーションの作成
  }

  // スプライトシートのロード
  public static loadAssets(scene: Scene): void {
    scene.load.spritesheet(FLAME_PILLAR_ATTACK_TEXTURE_KEY, flamePillarAttackImage, {
      frameWidth: 90, // 各フレームの幅
      frameHeight: 90, // 各フレームの高さ
    })
  }

  // アニメーションの作成
  private createAnimation(): void {
    this.scene.anims.create({
      key: 'flamePillarAnim',
      frames: this.scene.anims.generateFrameNumbers(FLAME_PILLAR_ATTACK_TEXTURE_KEY, {
        start: 0,
        end: 3,
      }),
      frameRate: 8, // フレームレート
      repeat: -1, // 繰り返し再生
    })
  }

  public setInitPosition(pos: Position): void {
    this.sprite.x = pos.x
    this.sprite.y = pos.y
  }

  public spawn(source: Position): void {
    this.sprite.active = true
    source = source.align()
    this.sprite.x = source.x
    this.sprite.y = source.y
    this.sprite.setPosition(source.x, source.y)
    this.sprite.setVisible(true)

    // アニメーションの再生
    this.sprite.play('flamePillarAnim')
  }

  public dead(): void {
    this.sprite.setVisible(false)
    this.sprite.destroy()
  }
}
