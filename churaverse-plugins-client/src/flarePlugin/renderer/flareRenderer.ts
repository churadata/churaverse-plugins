import { Direction, Position, layerSetting, vectorToName, FRAME_RATE} from 'churaverse-engine-client'
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
  [vectorToName(Direction.down),  { key: FLARE_ANIM_KEY, frameStart: 0, frameEnd: 8 }],
  [vectorToName(Direction.up),    { key: FLARE_ANIM_KEY, frameStart: 0, frameEnd: 8 }],
  [vectorToName(Direction.left),  { key: FLARE_ANIM_KEY, frameStart: 0, frameEnd: 8 }],
  [vectorToName(Direction.right), { key: FLARE_ANIM_KEY, frameStart: 0, frameEnd: 8 }],
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
    this.sprite = scene.add
      .sprite(-100, -100, FLARE_TEXTURE_KEY, 0)
      .setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE)

    // constructor 内のアニメーション登録部分
    _anims.forEach((cfg) => {
      if (!scene.anims.exists(cfg.key)) {
        scene.anims.create({
          key: cfg.key,
          frames: scene.anims.generateFrameNumbers(FLARE_TEXTURE_KEY, {
            start: cfg.frameStart,
            end:   cfg.frameEnd,
          }),
          frameRate: FRAME_RATE,
          repeat:    0, // 一度だけ再生する場合
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
   * 炎攻撃: 指定位置に炎を出現させ、アニメーション後に消滅
   * @param position 炎を出現させる位置
   * @param dest 使用しない（互換性のため残す）
   * @param direction 炎の方向
   * @param onUpdate 位置更新時のコールバック
   */
  public walk(position: Position, dest: Position, direction: Direction, onUpdate: (pos: Position) => void): void {

    // 初期位置を通知
    onUpdate(position)

  // 前方6マスに爆発エフェクトを伝播（300ms間隔）
    this.propagateExplosion(position, direction, 6, 300)
  }

    public propagateExplosion(position: Position, direction: Direction, length: number, delayMs: number): void {
      const offset = this.getDirectionOffset(direction)
      
      for (let i = 0; i < length; i++) {
        const delay = delayMs * i
        this.scene.time.delayedCall(delay, () => {
          const explosionX = position.x + offset.x * i
          const explosionY = position.y + offset.y * i
          this.createFlare(explosionX, explosionY, direction)
        })
      }

    // アニメーション開始
    const animKey = _anims.get(vectorToName(direction))?.key
    if (animKey !== undefined) {
      this.sprite.anims.play(animKey)
      
      // アニメーション完了時に炎を消滅させる
      this.sprite.once('animationcomplete', () => {
        this.sprite.setVisible(false)
        this.sprite.active = false
        // 必要に応じてspriteを破棄する場合
        // this.sprite.destroy()
      })
    } else {
      // アニメーションキーがない場合は即座に消滅
      this.sprite.setVisible(false)
      this.sprite.active = false
    }
  }

  public dead(): void {
    this.tween?.stop()
    this.sprite.setVisible(false)
    this.sprite.active = false
    // 必要に応じて破棄
    // this.sprite.destroy()
  }

  /**
   * 追加関数: 方向に沿って炎をコマ遅れで連続表示する
   * @param position  発射起点の座標（プレイヤー位置）
   * @param direction 向き
   * @param length    伝播させるマス数（デフォルト6）
   * @param delayMs   各マスごとの遅延時間[ms]（デフォルト300）
   */
  public propagate(
    position: Position,
    direction: Direction,
    length: number = 6,
    delayMs: number = 300
  ): void {
    const offset = this.getDirectionOffset(direction)
  
    for (let i = 0; i <= length; i++) {
      const delay = delayMs * i
      const flameX = position.x + offset.x * i
      const flameY = position.y + offset.y * i
  
      // 最初の炎は二重生成（4フレーム後に同じ位置で再生成）
      this.scene.time.delayedCall(delay, () => {
        this.createFlare(flameX, flameY, direction)
  
        // 4フレーム後に同じ位置で再度炎を生成
        if (i === 0) {
          this.scene.time.delayedCall(delay + 4 * (1000 / FRAME_RATE), () => {
            this.createFlare(flameX, flameY, direction)
          })
        }
      })
    }
  }
  
  private createFlare(x: number, y: number, direction: Direction): void {
    const flame = this.scene.add
      .sprite(x, y, FLARE_TEXTURE_KEY, 0)
      .setDisplaySize(DISPLAY_SIZE, DISPLAY_SIZE)
    layerSetting(flame, 'player', 20)
  
    const animKey = _anims.get(vectorToName(direction))!.key
    flame.anims.play(animKey)
    flame.once('animationcomplete', () => flame.destroy())
  }
  

  /**
   * 追加関数: Directionごとの1マス分のピクセルオフセットを返す
   * @param direction 向き
   */
  public getDirectionOffset(direction: Direction): { x: number; y: number } {
    switch (direction) {
      case Direction.up:    return { x: 0,             y: -DISPLAY_SIZE }
      case Direction.down:  return { x: 0,             y:  DISPLAY_SIZE }
      case Direction.left:  return { x: -DISPLAY_SIZE, y: 0             }
      case Direction.right: return { x:  DISPLAY_SIZE, y: 0             }
      default:
      // 未知の direction が来たらエラーを投げして、必ず戻り値があるよう補強
      throw new Error(`Invalid direction: ${direction}`)
    }
  }
}
