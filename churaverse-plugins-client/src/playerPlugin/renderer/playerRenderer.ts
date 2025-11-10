import {
  vectorToName,
  Direction,
  Position,
  GRID_SIZE,
  layerSetting,
  FRAME_RATE,
  HpBarRenderer,
} from 'churaverse-engine-client'
import { GameObjects, Scene } from 'phaser'
import { IPlayerRenderer } from '../domain/IPlayerRenderer'
import { PLAYER_COLOR_NAMES, PlayerColor } from '../types/playerColor'
import { PlayerIconsRenderer } from './playerIconsRenderer'
import heroBasic from '../assets/hero.png'
import heroRed from '../assets/hero_red.png'
import heroBlack from '../assets/hero_black.png'
import heroBlue from '../assets/hero_blue.png'
import heroGray from '../assets/hero_gray.png'

/**
 * 初期色の名前 = basic
 */
export const DEFAULT_COLOR_NAME = PLAYER_COLOR_NAMES[0]

/**
 * プレイヤーのテクスチャの色の名前
 */
const TEXTURE_KEYS: { [key in PlayerColor]: string } = {
  basic: 'basicHero',
  red: 'redHero',
  black: 'blackHero',
  blue: 'blueHero',
  gray: 'grayHero',
}

/**
 * プレイヤーのテクスチャの色とファイル名
 */

const TEXTURE_FILENAMES: { [key in PlayerColor]: string } = {
  basic: heroBasic,
  red: heroRed,
  black: heroBlack,
  blue: heroBlue,
  gray: heroGray,
}

/**
 * 移動アニメーションの設定配列
 * オブジェクトリテラルに
 */
const _anims = new Map<string, { key: string; frameStart: number; frameEnd: number }>([
  [vectorToName(Direction.up), { key: 'walk_back', frameStart: 11, frameEnd: 9 }],
  [vectorToName(Direction.down), { key: 'walk_front', frameStart: 0, frameEnd: 2 }],
  [vectorToName(Direction.left), { key: 'walk_left', frameStart: 3, frameEnd: 5 }],
  [vectorToName(Direction.right), { key: 'walk_right', frameStart: 6, frameEnd: 8 }],
])

/**
 * PlayerのSpriteから名前プレートの相対座標
 */
const _relativePositionToNamePlate = { x: 0, y: -40 }

/**
 * Player描画クラス
 */
export class PlayerRenderer implements IPlayerRenderer {
  private readonly scene
  private sprite

  private tween?: Phaser.Tweens.Tween
  private readonly _playerNamePlateTween?: Phaser.Tweens.Tween
  private damagetween?: Phaser.Tweens.Tween
  private color: PlayerColor
  private readonly playerContainer: Phaser.GameObjects.Container
  private readonly playerFrontContainer: Phaser.GameObjects.Container
  private readonly _playerNamePlate: Phaser.GameObjects.Text
  private readonly hpBar: HpBarRenderer

  public constructor(
    scene: Scene,
    position: Position,
    direction: Direction,
    name: string,
    color: PlayerColor,
    hp: number
  ) {
    this.hpBar = new HpBarRenderer(scene, 100, hp)
    this.scene = scene
    this.color = color
    this.playerContainer = this.scene.add.container(position.x, position.y)
    this.playerFrontContainer = this.scene.add.container(position.x, position.y)

    this.sprite = scene.add
      .sprite(0, 0, TEXTURE_KEYS[DEFAULT_COLOR_NAME])
      // 縮尺
      .setOrigin(0.5)
      .setDisplaySize(GRID_SIZE, GRID_SIZE)
    this.playerContainer.add(this.sprite)
    layerSetting(this.playerContainer, 'player')

    this._playerNamePlate = scene.add
      .text(_relativePositionToNamePlate.x, _relativePositionToNamePlate.y, name)
      .setOrigin(0.5)
      .setStroke('#403c3c', 3)

    _anims.forEach((cfg) => {
      this.sprite.anims.create({
        key: cfg.key,
        frames: scene.anims.generateFrameNumbers(TEXTURE_KEYS[color], {
          start: cfg.frameStart,
          end: cfg.frameEnd,
        }),
        frameRate: FRAME_RATE,
        repeat: -1,
      })
    })

    this.turn(direction)

    this.playerFrontContainer.add(this._playerNamePlate)
    this.hpBar.addContainer(this.playerFrontContainer)
    layerSetting(this.playerFrontContainer, 'abovePlayer')
    this.hpBar.update(hp)
  }

  public static loadAssets(scene: Scene): void {
    PLAYER_COLOR_NAMES.forEach((name: PlayerColor) =>
      scene.load.spritesheet(TEXTURE_KEYS[name], TEXTURE_FILENAMES[name], {
        frameWidth: 32,
        frameHeight: 32,
      })
    )

    PlayerIconsRenderer.loadAssets(scene)
  }

  /**
   * classのbuild関数
   * Promise<PlayerRender>でのreturnできないため
   * @param scene シーン
   * @param mapLayer mapのLayer 衝突用
   * @param pos 初期位置
   * @param name 初期プレイヤー名
   * @param color 初期プレイヤー色
   * @returns this
   */
  public static async build(
    scene: Scene,
    pos: Position,
    direction: Direction,
    name: string,
    color: PlayerColor,
    hp: number
  ): Promise<PlayerRenderer> {
    return await new Promise<void>((resolve, reject) => {
      if (scene.textures.exists(TEXTURE_KEYS[DEFAULT_COLOR_NAME])) {
        resolve()
      }

      PLAYER_COLOR_NAMES.forEach((name: PlayerColor) =>
        scene.load.spritesheet(TEXTURE_KEYS[name], TEXTURE_FILENAMES[name], {
          frameWidth: 32,
          frameHeight: 32,
        })
      )

      scene.load.once('complete', () => {
        resolve()
      })
      scene.load.start()
    }).then(() => {
      return new PlayerRenderer(scene, pos, direction, name, color, hp)
    })
  }

  /**
   * playerのidをnameにセットしておく
   * @param id playerのid
   */
  public setSpriteId(id: string): void {
    this.sprite.name = id
  }

  /**
   * 姿を現す関数
   */
  public appear(): void {
    this.hpBar.appear()
    this.playerContainer.setVisible(true)
    this.playerFrontContainer.setVisible(true)
    this.sprite.alpha = 1
    this._playerNamePlate.alpha = 1
  }

  /**
   * 姿を消す関数
   */
  public disappear(): void {
    this.hpBar.disappear()
    this.playerContainer.setVisible(false)
    this.playerFrontContainer.setVisible(false)
    this.sprite.alpha = 0
    this._playerNamePlate.alpha = 0
  }

  /**
   * リスポーンを描画する関数
   * @param position リスポーン後の位置
   */
  public respawn(position: Position, direction: Direction, hp: number): void {
    this.turn(direction)
    this.hpBar.update(hp)
    this.teleport(position)
    this.appear()
  }

  /**
   * ゲームから離れる
   */
  public leave(): void {
    this.stop()
    this.disappear()
    this.sprite.destroy()
    this._playerNamePlate.destroy()
    this.hpBar.destroy()
    this.playerContainer.destroy()
    this.playerFrontContainer.destroy()
  }

  /**
   * 画面の追従を開始する
   */
  public focus(): void {
    this.scene.cameras.main.startFollow(this.playerContainer)
  }

  public ignore(): void {
    this.scene.cameras.main.stopFollow()
  }

  /**
   * 方向転換
   * @param direction 向き
   * @param color 今の色
   */
  public turn(direction: Direction): void {
    // 方向転換 0は下向き
    this.sprite.setTexture(TEXTURE_KEYS[this.color], _anims.get(vectorToName(direction))?.frameStart ?? 0)
  }

  /**
   * 歩きのアニメーションを設定する関数
   * @param dest 歩いた先の座標
   */
  public walk(
    dest: Position,
    direction: Direction,
    speed: number,
    onUpdate: (pos: Position) => void,
    onComplete: () => void
  ): void {
    const duration = GRID_SIZE / speed

    this.tween = this.scene.add.tween({
      targets: [this.playerContainer, this.playerFrontContainer],

      // X座標の移動を設定
      x: dest.x,

      // Y座標の移動を設定
      y: dest.y,

      // 通信によるラグで歩行距離が伸びた場合は移動速度が上がって調整される
      // 一定以上離れるとteleportで調整する
      duration,

      onUpdate: () => {
        onUpdate(new Position(this.playerContainer.x, this.playerContainer.y))
      },

      onComplete: () => {
        // tweenの上書きが行われていた場合は実行しない
        if (this.tween?.isPlaying() ?? false) return
        if (this === undefined) return
        this.stopWalk()
        onComplete()
      },
    })

    // アニメーション開始
    const animKey = _anims.get(vectorToName(direction))?.key
    if (animKey !== undefined) {
      this.sprite.anims.play(animKey)
    }
  }

  /**
   * 歩行アニメーションを停止する
   */
  private stopWalk(): void {
    // 移動中にleaveした場合animsはundefinedになる
    if (this.sprite.anims === undefined) return

    // tweenをstopすると滑らかなアニメーションにならないためanimsのみpause
    this.sprite.anims.pause()
  }

  /**
   * アニメーション･tweenを止める関数
   */
  public stop(): void {
    this.sprite.anims.stop()
    this._playerNamePlateTween?.stop()
    this.stopAllTweens(this.playerContainer)
    this.stopAllTweens(this.playerFrontContainer)
  }

  /**
   * テレポートするの関数
   * warpは名前として間違いのため名前変更
   * @param position テレポート先座標
   */
  public teleport(position: Position): void {
    // 動きを止めてる
    this.stop()
    this.playerContainer.setPosition(position.x, position.y)
    this.playerFrontContainer.setPosition(position.x, position.y)
  }

  /**
   * spriteに基づいたすべてのtweenを止める関数
   */
  private stopAllTweens(container: Phaser.GameObjects.Container): void {
    // SpriteのTweenを全て取得
    const tweens = this.scene.tweens.getTweensOf(container)
    this.damagetween?.stop()
    // 全てのTweenを停止
    for (const tween of tweens) {
      tween.stop()
    }
  }

  /**
   * 死んだときのアニメーション
   */
  public dead(): void {
    this.stop()
    this.disappear()
  }

  /**
   * ダメージを受けたときのアニメーション
   * @param amount 受けたダメージ数
   */
  public damage(amount: number, hp: number): void {
    // プレイヤー近くにダメージをランダムに表記させる範囲
    const X_MIN = -20
    const X_MAX = 20
    const Y_MIN = 0
    const Y_MAX = 20
    const x = this.sprite.x + Math.random() * (X_MAX - X_MIN) + X_MIN
    const y = this.sprite.y + Math.random() * (Y_MAX - Y_MIN) + Y_MIN
    const MOVE_Y = 30 // damageTextが30ずつ上に上がる
    const DURATION = 300 // ダメージが表示されて消えていく時間
    const THICKNESS = 5 // damageTextの縁の太さ
    const damageText = this.scene.add
      .text(x, y, amount.toString(), { fontSize: '23px' })
      .setOrigin(0.5)
      .setStroke('#505050', THICKNESS)
    this.playerFrontContainer.add(damageText)
    const tween = this.scene.add.tween({
      targets: [damageText],
      x,
      y: y - MOVE_Y,
      alpha: 0,
      duration: DURATION, // DURATION時間の間damageTextが30ずつ上に上がる
      // tween完了時に実行される関数
      onComplete: () => {
        tween.stop()
        damageText.destroy()
      },
    })
    this.hpBar.update(hp)
    this.damagetween?.stop() // 処理の途中で新たにダメージを食らった際に処理をリセットする
    this.damagetween = this.scene.add.tween({
      targets: this.sprite,
      duration: 40,
      repeat: 8, // 8回繰り返す
      yoyo: true,
      alpha: { start: 0, to: 1 },
      onComplete: () => {
        this.sprite.alpha = 1
      },
      onStop: () => {
        this.sprite.alpha = 1
      },
    })
  }

  /**
   * プレイヤーが回復を行うときのアニメーション
   * @param healAmount 回復量
   * @param hp 回復後のHP
   */
  public heal(healAmount: number, hp: number): void {
    // プレイヤー近くに回復量をランダムに表記させる範囲
    const X_MIN = -20
    const X_MAX = 20
    const Y_MIN = 0
    const Y_MAX = 20
    const x = this.sprite.x + Math.random() * (X_MAX - X_MIN) + X_MIN
    const y = this.sprite.y + Math.random() * (Y_MAX - Y_MIN) + Y_MIN
    const MOVE_Y = 30 // healTextが30ずつ上に上がる
    const DURATION = 300 // 回復量が表示されて消えていく時間
    const THICKNESS = 5 // healTextの縁の太さ
    const healText = this.scene.add
      .text(x, y, `+${healAmount}`, { fontSize: '23px' })
      .setOrigin(0.5)
      .setStroke('#FFC300', THICKNESS)
    this.playerFrontContainer.add(healText)
    const tween = this.scene.add.tween({
      targets: [healText],
      x,
      y: y - MOVE_Y,
      alpha: 0,
      duration: DURATION, // DURATION時間かけてhealTextが30上に上がる
      // tween完了時に実行される関数
      onComplete: () => {
        tween.stop()
        healText.destroy()
      },
    })
    this.hpBar.update(hp)
  }

  /**
   * プレイヤーの色を適用する色
   * @param color プレイヤーに適用する色の名前
   */
  public applyPlayerColor(color: PlayerColor): void {
    this.removeWalkAnim()
    this.color = color
    this.sprite.setTexture(TEXTURE_KEYS[color], this.sprite.frame.name)

    // アニメーションも適応
    _anims.forEach((cfg) => {
      this.sprite.anims.create({
        key: cfg.key,
        frames: this.scene.anims.generateFrameNumbers(TEXTURE_KEYS[color], {
          start: cfg.frameStart,
          end: cfg.frameEnd,
        }),
        frameRate: FRAME_RATE,
        repeat: -1,
      })
    })
  }

  /**
   * 名前の表示の変更をする関数
   * @param name 変更後の名前
   */
  public applyPlayerName(name: string): void {
    this._playerNamePlate.setText(name).setOrigin(0.5)
  }

  /**
   * spriteを消滅させる関数
   */
  public destroy(): void {
    this.hpBar.destroy()
    this.playerContainer.destroy()
    this.playerFrontContainer.destroy()
    this.sprite.destroy()
    this._playerNamePlate.destroy()
  }

  /**
   * playerのアニメーションを削除する
   */
  private removeWalkAnim(): void {
    _anims.forEach((cfg) => {
      this.sprite.anims.remove(cfg.key)
    })
  }

  public setParentContainer(container: GameObjects.Container): void {
    container.add(this.playerContainer)
    container.add(this.playerFrontContainer)
  }

  public addToPlayerContainer(child: GameObjects.GameObject): void {
    this.playerContainer.add(child)
  }

  public addToPlayerFrontContainer(child: Phaser.GameObjects.GameObject): void {
    this.playerFrontContainer.add(child)
  }

  /**
   * プレイヤーの透明度を設定する
   * @param alpha 透明度(0-1)
   */
  public setSpriteAlpha(alpha: number): void {
    this.playerContainer.alpha = alpha
  }

  /**
   * プレイヤーを点滅させる。一回の点滅は200ms
   * @param blinkTime 点滅の時間
   */
  public blinkPlayer(blinkTime: number): void {
    this.scene.tweens.add({
      targets: this.playerContainer,
      alpha: { start: 0, to: 1 },
      duration: 100,
      repeat: blinkTime / 200,
      yoyo: true,
      onComplete: () => {
        this.playerContainer.alpha = 1
      },
      onStop: () => {
        this.playerContainer.alpha = 1
      },
    })
  }
}
