import { Scene } from 'phaser'
import { IPlayerRenderer } from '@churaverse/player-plugin-client/domain/IPlayerRenderer'
import { NyokkiStatus } from '../../type/nyokkiStatus'

import RANK_FRAME from '../../assets/nyokkiOrderIcons/rankFrame.png'
import MISS from '../../assets/nyokkiOrderIcons/miss.png'
import RANK1 from '../../assets/nyokkiOrderIcons/rank1.png'
import RANK2 from '../../assets/nyokkiOrderIcons/rank2.png'
import RANK3 from '../../assets/nyokkiOrderIcons/rank3.png'
import RANK_ORDER_PATH from '../../assets/nyokkiOrderIcons/rank_order_number.png'

const rankPaths = [RANK1, RANK2, RANK3]
const RANK_ORDER_NAME = 'rank_order_number'

export class PlayerNyokkiStatusIcon {
  private successIconActive!: Phaser.GameObjects.Image
  private successRankFrame!: Phaser.GameObjects.Image
  private nyokkiIconActive!: Phaser.GameObjects.Image

  public constructor(scene: Scene, playerRenderer: IPlayerRenderer) {
    this.init(scene, playerRenderer)
  }

  private init(scene: Scene, playerRenderer: IPlayerRenderer): void {
    const iconPosX = 0
    const iconPosY = -88
    const iconSizeX = 35
    const iconSizeY = 35
    const missSizeX = 50
    const missSizeY = 30

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

    scene.load.spritesheet(RANK_ORDER_NAME, RANK_ORDER_PATH, {
      frameWidth: 16,
      frameHeight: 24,
    })
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
    // 1位~3位は専用アイコンを表示
    if (order <= 3) {
      const iconKey = `rank${order}`
      this.successIconActive.setTexture(iconKey)
      this.successIconActive.setAlpha(1)
    }

    // 4位~9位は枠と数字を表示
    if (order >= 4 && order < 10) {
      this.successRankFrame.setTexture('rankFrame')
      this.successRankFrame.setAlpha(1)

      this.successIconActive.setTexture('rank_order_number')
      this.successIconActive.setFrame(order)
      this.successIconActive.setAlpha(1)
    }
  }

  public resetStatusIcon(): void {
    this.successIconActive.setAlpha(0)
    this.successRankFrame.setAlpha(0)
    this.nyokkiIconActive.setAlpha(0)
  }
}
