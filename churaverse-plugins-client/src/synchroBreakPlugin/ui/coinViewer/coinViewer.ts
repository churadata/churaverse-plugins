import { Scene } from 'phaser'
import { IPlayerRenderer } from '@churaverse/player-plugin-client/domain/IPlayerRenderer'

import BET_ICON_PATH from '../../assets/betCoin/bet.png'
import NUMBER_PATH from '../../assets/betCoin/bet_coin_number.png'

const BET_ICON_NAME = 'bet_icon'
const NUMBER_NAME = 'bet_coin_number_icon'

const betUiPosX = 80
const betUiPosY = 25
const numberIconPosX = 11
const numberIconPosY = 12

export class CoinViewer {
  private betUi?: Phaser.GameObjects.Image
  private coinUi: Phaser.GameObjects.Image[] = []

  public constructor(
    private readonly scene: Scene,
    private readonly playerRenderer: IPlayerRenderer
  ) {}

  public removeBetUi(): void {
    if (this.betUi !== undefined) {
      this.removeBetCoins()
      this.betUi.destroy()
    }
  }

  /**
   * プレイヤーのベットコインを表示する
   */
  public setBetCoins(betCoins: number): void {
    this.betUi = this.scene.add.image(0, 35, BET_ICON_NAME).setDisplaySize(betUiPosX, betUiPosY).setAlpha(1).setDepth(0)

    this.playerRenderer.addToPlayerContainer(this.betUi)

    const betCoinsStr = betCoins.toString()
    const numDigits = betCoinsStr.length

    // ベットコイン数の表示位置を中央揃えにするため、描画を開始するX座標を算出
    const totalWidth = numDigits * numberIconPosX + (numDigits - 1) * 2
    const startX = 14 - totalWidth / 2 + numberIconPosX / 2

    for (let i = 0; i < numDigits; i++) {
      const digit = betCoinsStr[i]

      // 各桁の描画する位置を計算(非整数値になると、Uiがぼやけて描画されるとため、整数で位置を指定)
      const xOffset = Math.round(startX + (numberIconPosX + 2) * i)

      const coinImage = this.scene.add
        .image(xOffset, 35, NUMBER_NAME)
        .setFrame(Number(digit))
        .setDisplaySize(numberIconPosX, numberIconPosY)
        .setAlpha(1)
        .setDepth(0)

      this.coinUi.push(coinImage)
      this.playerRenderer.addToPlayerContainer(coinImage)
    }
  }

  private removeBetCoins(): void {
    this.coinUi.forEach((coin) => {
      coin.destroy()
    })
    this.coinUi = [] // coinUi配列をクリア
  }

  /**
   * ベットコインの画像を読み込む
   */
  public static loadAssets(scene: Scene): void {
    scene.load.image(BET_ICON_NAME, BET_ICON_PATH)
    scene.load.spritesheet(NUMBER_NAME, NUMBER_PATH, {
      frameWidth: 9,
      frameHeight: 12,
    })
  }
}
