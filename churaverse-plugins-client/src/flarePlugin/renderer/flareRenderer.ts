import { Direction, Position, layerSetting, vectorToName, FRAME_RATE } from 'churaverse-engine-client'
import { IFlareRenderer } from '../domain/IFlareRenderer'
import { Scene } from 'phaser'
import flareImage from '../assets/flare.png'

/**
 * 炎のテクスチャキー
 */
const FLARE_TEXTURE_KEY = 'flare'

/**
 *炎のアニメーションキー
 */
const FLARE_ANIM_KEY = 'flare'

/**
 * 表示時の縦横のサイズ
 */
const DISPLAY_SIZE = 60

/**
 * アニメーションの設定配列
 * どの方向でも同じ 0～8 フレームを再生する
 */
const _anims = new Map<string, { key: string; frameStart: number; frameEnd: number }>([
  [vectorToName(Direction.down), { key: 'flare_go_down', frameStart: 0, frameEnd: 8 }],
  [vectorToName(Direction.up), { key: 'flare_go_up', frameStart: 0, frameEnd: 8 }],
  [vectorToName(Direction.left), { key: 'flare_go_left', frameStart: 0, frameEnd: 8 }],
  [vectorToName(Direction.right), { key: 'flare_go_right', frameStart: 0, frameEnd: 8 }],
])


/**
 * Flareの描画クラス
 */
export class FlareRenderer implements IFlareRenderer {
  public scene: Scene
  public sprite: Phaser.GameObjects.Sprite
  public tween?: Phaser.Tweens.Tween

  public constructor(scene: Scene) {
    this.scene = scene
    this.sprite = scene.add.sprite(
      -100,
      -100, 
      FLARE_TEXTURE_KEY, 
      0
    ).setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE)

    // constructor 内のアニメーション登録部分
    _anims.forEach((cfg) => {
      if (!scene.anims.exists(cfg.key)) {
        scene.anims.create({
          key: cfg.key,
          frames: scene.anims.generateFrameNumbers(FLARE_ANIM_KEY, {
            start: cfg.frameStart,
            end: cfg.frameEnd,
          }),
          frameRate: FRAME_RATE,
          repeat: 0, 
        })
      }
    })
    layerSetting(this.sprite, 'player', 20)
  }

  /**
   * テクスチャのロード
   */
  public static loadAssets(scene: Scene): void {
    scene.load.spritesheet(FLARE_TEXTURE_KEY, flareImage, {
      frameWidth: 341,
      frameHeight: 341,
    })
  }

  public setSpriteId(id: string): void {
    this.sprite.name = id
  }

  /**
   * 炎攻撃: 指定位置に炎を出現させ、アニメーション後に消滅 (ソースコードの walk メソッドのロジックを適用)
   * @param position 炎を出現させる位置
   * @param dest 使用しない（互換性のため残す）
   * @param direction 炎の方向
   * @param onUpdate 位置更新時のコールバック (初期位置でのみ呼び出し)
   */
  
  public spread(position: Position, dest: Position, direction: Direction, onUpdate: (pos: Position) => void): void {
    onUpdate(position)

    // 爆発エフェクトを伝播 
    // this.sprite のアニメーションや表示管理は propagateExplosion 内で行う
    this.propagateExplosion(position, direction, 6, 300)
  }

  /**
   * 爆発を指定されたオフセットと遅延で伝播させます。
   * また、this.sprite (メインスプライト) のアニメーションと表示管理もここで行います。
   */
  public propagateExplosion(position: Position, direction: Direction, length: number, delayMs: number): void {
    const offset = this.getDirectionOffset(direction)

    // 個別の伝播する炎を生成
    for (let i = 0; i < length; i++) {
      const currentDelay = delayMs * i
      this.scene.time.delayedCall(currentDelay, () => {
        const explosionX = position.x + offset.x * i
        const explosionY = position.y + offset.y * i
        this.createFlare(explosionX, explosionY, direction)
      })
    }

    // メインスプライト (this.sprite) のアニメーション処理 (ソースコードの propagateExplosion の挙動)
    this.sprite.setPosition(position.x, position.y) // 攻撃位置に配置
    this.sprite.setVisible(true)
    this.sprite.active = true

    const animKey = _anims.get(vectorToName(direction))?.key // FLARE_ANIM_KEY が取得される
    if (animKey !== undefined) {
      this.sprite.anims.play(animKey)
      
      this.sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.sprite.setVisible(false)
        this.sprite.active = false
        this.sprite.destroy() 
        })
    } else {
      // アニメーションキーがない場合は即座に非表示・非アクティブ化
      this.sprite.setVisible(false)
      this.sprite.active = false
    }
  }

  /**
   * 指定された位置に炎スプライトを生成し、アニメーションさせ、完了後に破棄します。
   */
  private createFlare(x: number, y: number, direction: Direction): void {
    const flame = this.scene.add
      .sprite(x, y, FLARE_TEXTURE_KEY, 0)
      .setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE)
    layerSetting(flame, 'player', 20)

    // _anims から取得する key は FLARE_ANIM_KEY になる
    const animKey = _anims.get(vectorToName(direction))?.key 
    if (animKey !== undefined) {
      flame.anims.play(animKey)
      flame.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        flame.destroy()
      })
    } else {
      // console.warn は維持、キーが見つからない場合は即座に破棄
      console.warn(`Animation key for created flare not found for direction: ${vectorToName(direction)}. Destroying flare.`)
      flame.destroy()
    }
  }

  public dead(): void {
    this.tween?.stop()
    this.sprite.destroy()
  }

  /**
   * Directionごとの1マス分のピクセルオフセットを返す (vectorToName を使用する改善版を維持)
   */
  public getDirectionOffset(direction: Direction): { x: number; y: number } {
    const offsetSize = DISPLAY_SIZE;
    const directionName = vectorToName(direction);

    switch (directionName) {
      case vectorToName(Direction.up):
        return { x: 0, y: -offsetSize };
      case vectorToName(Direction.down):
        return { x: 0, y: offsetSize };
      case vectorToName(Direction.left):
        return { x: -offsetSize, y: 0 };
      case vectorToName(Direction.right):
        return { x: offsetSize, y: 0 };
      default:
        throw new Error(`Invalid direction name: ${directionName} (from vector: ${JSON.stringify(direction)})`);
    }
  }
}