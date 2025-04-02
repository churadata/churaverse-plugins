import { Scene } from 'phaser'
import { IPlayerRenderer } from '@churaverse/player-plugin-client/domain/IPlayerRenderer'
import { NyokkiStatus } from '../../type/nyokkiStatus'

import RANK_FRAME from '../../assets/nyokkiOrderIcons/rankFrame.png'
import MISS from '../../assets/nyokkiOrderIcons/miss.png'
import RANK1 from '../../assets/nyokkiOrderIcons/rank1.png'
import RANK2 from '../../assets/nyokkiOrderIcons/rank2.png'
import RANK3 from '../../assets/nyokkiOrderIcons/rank3.png'
import NUMBER_DIN0 from '../../assets/nyokkiOrderIcons/number_din0.png'
import NUMBER_DIN1 from '../../assets/nyokkiOrderIcons/number_din1.png'
import NUMBER_DIN2 from '../../assets/nyokkiOrderIcons/number_din2.png'
import NUMBER_DIN3 from '../../assets/nyokkiOrderIcons/number_din3.png'
import NUMBER_DIN4 from '../../assets/nyokkiOrderIcons/number_din4.png'
import NUMBER_DIN5 from '../../assets/nyokkiOrderIcons/number_din5.png'
import NUMBER_DIN6 from '../../assets/nyokkiOrderIcons/number_din6.png'
import NUMBER_DIN7 from '../../assets/nyokkiOrderIcons/number_din7.png'
import NUMBER_DIN8 from '../../assets/nyokkiOrderIcons/number_din8.png'
import NUMBER_DIN9 from '../../assets/nyokkiOrderIcons/number_din9.png'

const numberPaths = [
  NUMBER_DIN0,
  NUMBER_DIN1,
  NUMBER_DIN2,
  NUMBER_DIN3,
  NUMBER_DIN4,
  NUMBER_DIN5,
  NUMBER_DIN6,
  NUMBER_DIN7,
  NUMBER_DIN8,
  NUMBER_DIN9,
]

const rankPaths = [RANK1, RANK2, RANK3]

export class PlayerNyokkiStatusIcon {
  private successIconActive!: Phaser.GameObjects.Image
  private successRankFrame!: Phaser.GameObjects.Image
  private nyokkiIconActive!: Phaser.GameObjects.Image

  public constructor(scene: Scene, playerRenderer: IPlayerRenderer) {
    this.init(scene, playerRenderer)
  }

  private init(scene: Scene, playerRenderer: IPlayerRenderer): void {
    const iconPosX = 0
    const iconPosY = -85
    const iconSizeX = 19
    const iconSizeY = 19
    const missSizeX = 42
    const missSizeY = 28

    this.successRankFrame = scene.add
      .image(iconPosX, iconPosY, 'rankFrame')
      .setDisplaySize(iconSizeX, iconSizeY)
      .setAlpha(0)
      .setDepth(1) // 背景の深度を1に設定

    this.successIconActive = scene.add
      .image(iconPosX, iconPosY, 'number_din1')
      .setDisplaySize(iconSizeX, iconSizeY)
      .setAlpha(0)
      .setDepth(2) // 順位画像の深度を2に設定

    this.nyokkiIconActive = scene.add
      .image(iconPosX, iconPosY, 'miss')
      .setDisplaySize(missSizeX, missSizeY)
      .setAlpha(0)
      .setDepth(3)

    playerRenderer.addToPlayerFrontContainer(this.successRankFrame)
    playerRenderer.addToPlayerFrontContainer(this.successIconActive)
    playerRenderer.addToPlayerFrontContainer(this.nyokkiIconActive)
  }

  public static loadAssets(scene: Scene): void {
    scene.load.image('rankFrame', RANK_FRAME)
    scene.load.image('miss', MISS)

    for (let order = 1; order <= 3; order++) {
      const rankKey = `rank${order}`
      const rankPath = rankPaths[order - 1]
      scene.load.image(rankKey, rankPath)
    }

    for (let order = 0; order <= 9; order++) {
      const numberKey = `number_din${order}`
      const numberPath = numberPaths[order]
      scene.load.image(numberKey, numberPath)
    }
  }

  /**
   * プレイヤーのニョッキステータスアイコンを表示する
   * @param order ニョッキした順位
   * @param status ニョッキの状態
   */
  public handlePlayerSynchroBreakIcons(order: number, status: NyokkiStatus): void {
    // 10位以上の場合は結果を表示しない
    if (order >= 10) return

    // ステータスごとの表示処理
    switch (status) {
      case 'nyokki':
        this.displayMissIcon()
        break
      case 'success':
        this.displaySuccessIcon(order)
        break
    }
  }

  /**
   * ニョッキ失敗アイコンを表示
   */
  private displayMissIcon(): void {
    this.nyokkiIconActive.setTexture('miss')
    this.nyokkiIconActive.setAlpha(1)
  }

  /**
   * nyokki成功のアイコンを表示
   */
  private displaySuccessIcon(order: number): void {
    // 順位に応じたアイコンを選択
    const iconKey = order <= 3 ? `rank${order}` : `number_din${order}`
    this.successIconActive.setTexture(iconKey)
    this.successIconActive.setAlpha(1)

    // 4位以下は枠も表示
    if (order >= 4 && order < 10) {
      this.successRankFrame.setTexture('rankFrame')
      this.successRankFrame.setAlpha(1)
    }
  }

  public resetStatusIcon(): void {
    this.successIconActive.setAlpha(0)
    this.successRankFrame.setAlpha(0)
    this.nyokkiIconActive.setAlpha(0)
  }
}
