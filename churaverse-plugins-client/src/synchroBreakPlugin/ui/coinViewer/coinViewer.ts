import { Scene } from 'phaser'
import { IPlayerRenderer } from '@churaverse/player-plugin-client/domain/IPlayerRenderer'

import BET_ICON_PATH from '../../assets/betCoin/bet.png'
import NUMBER_HEL0_PATH from '../../assets/betCoin/number_hel0.png'
import NUMBER_HEL1_PATH from '../../assets/betCoin/number_hel1.png'
import NUMBER_HEL2_PATH from '../../assets/betCoin/number_hel2.png'
import NUMBER_HEL3_PATH from '../../assets/betCoin/number_hel3.png'
import NUMBER_HEL4_PATH from '../../assets/betCoin/number_hel4.png'
import NUMBER_HEL5_PATH from '../../assets/betCoin/number_hel5.png'
import NUMBER_HEL6_PATH from '../../assets/betCoin/number_hel6.png'
import NUMBER_HEL7_PATH from '../../assets/betCoin/number_hel7.png'
import NUMBER_HEL8_PATH from '../../assets/betCoin/number_hel8.png'
import NUMBER_HEL9_PATH from '../../assets/betCoin/number_hel9.png'

const BET_ICON_NAME = 'bet_icon'
const NUMBER_HEL0_NAME = 'number_hel0'
const NUMBER_HEL1_NAME = 'number_hel1'
const NUMBER_HEL2_NAME = 'number_hel2'
const NUMBER_HEL3_NAME = 'number_hel3'
const NUMBER_HEL4_NAME = 'number_hel4'
const NUMBER_HEL5_NAME = 'number_hel5'
const NUMBER_HEL6_NAME = 'number_hel6'
const NUMBER_HEL7_NAME = 'number_hel7'
const NUMBER_HEL8_NAME = 'number_hel8'
const NUMBER_HEL9_NAME = 'number_hel9'

const betUiPosX = 75
const betUiPosY = 25
const numberIconPoxX = 11
const numberIconPoxY = 12

export class CoinViewer {
  private betUi!: Phaser.GameObjects.Image
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

    // betCoinsを文字列に変換し、桁ごとに画像を表示する
    const betCoinsStr = betCoins.toString()
    const numDigits = betCoinsStr.length

    const totalWidth = numDigits * numberIconPoxX + (numDigits - 1) * 2
    const startX = 14 - totalWidth / 2 + numberIconPoxX / 2

    // 各桁ごとに画像を追加
    for (let i = 0; i < numDigits; i++) {
      const digit = betCoinsStr[i]
      const numberName = `number_hel${digit}`

      // 各桁の位置を計算(非整数値になると、Uiがぼやけて表示されるため、整数で位置指定)
      const xOffset = Math.round(startX + (numberIconPoxX + 2) * i)

      // 新しいコインUIを設定
      const coinImage = this.scene.add
        .image(xOffset, 35, numberName)
        .setDisplaySize(numberIconPoxX, numberIconPoxY)
        .setAlpha(1)
        .setDepth(1)

      this.coinUi.push(coinImage)

      // コインUIをプレイヤーコンテナに追加
      this.playerRenderer.addToPlayerFrontContainer(coinImage)
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
    scene.load.image(NUMBER_HEL0_NAME, NUMBER_HEL0_PATH)
    scene.load.image(NUMBER_HEL1_NAME, NUMBER_HEL1_PATH)
    scene.load.image(NUMBER_HEL2_NAME, NUMBER_HEL2_PATH)
    scene.load.image(NUMBER_HEL3_NAME, NUMBER_HEL3_PATH)
    scene.load.image(NUMBER_HEL4_NAME, NUMBER_HEL4_PATH)
    scene.load.image(NUMBER_HEL5_NAME, NUMBER_HEL5_PATH)
    scene.load.image(NUMBER_HEL6_NAME, NUMBER_HEL6_PATH)
    scene.load.image(NUMBER_HEL7_NAME, NUMBER_HEL7_PATH)
    scene.load.image(NUMBER_HEL8_NAME, NUMBER_HEL8_PATH)
    scene.load.image(NUMBER_HEL9_NAME, NUMBER_HEL9_PATH)
  }
}
