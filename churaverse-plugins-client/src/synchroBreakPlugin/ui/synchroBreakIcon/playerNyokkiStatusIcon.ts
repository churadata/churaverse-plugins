import { Scene } from 'phaser'
import { IPlayerRenderer } from '@churaverse/player-plugin-client/domain/IPlayerRenderer'
import { NyokkiStatus } from '../../type/nyokkiStatus'

const PLAYER_NYOKKI_ORDER = `src/game/plugins/synchroBreakPlugin/assets/nyokkiOrderIcons/number_din${1}.png`
const RANK_FRAME = `src/game/plugins/synchroBreakPlugin/assets/nyokkiOrderIcons/rankFrame.png`
const MISS = `src/game/plugins/synchroBreakPlugin/assets/nyokkiOrderIcons/miss.png`

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
    const iconSizeX = 35
    const iconSizeY = 35

    this.successRankFrame = scene.add
      .image(iconPosX, iconPosY, RANK_FRAME)
      .setDisplaySize(iconSizeX, iconSizeY)
      .setAlpha(0)
      .setDepth(1) // 背景の深度を1に設定

    this.successIconActive = scene.add
      .image(iconPosX, iconPosY, PLAYER_NYOKKI_ORDER)
      .setDisplaySize(iconSizeX, iconSizeY)
      .setAlpha(0)
      .setDepth(2) // 順位画像の深度を2に設定

    this.nyokkiIconActive = scene.add
      .image(iconPosX, iconPosY, MISS)
      .setDisplaySize(iconSizeX, iconSizeY)
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
      const rankPath = `src/game/plugins/synchroBreakPlugin/assets/nyokkiOrderIcons/rank${order}.png`
      scene.load.image(rankKey, rankPath)
    }

    for (let order = 0; order <= 9; order++) {
      const numberKey = `number${order}`
      const numberPath = `src/game/plugins/synchroBreakPlugin/assets/nyokkiOrderIcons/number_din${order}.png`
      scene.load.image(numberKey, numberPath)
    }
  }

  public handlePlayerSynchroBreakIcons(order: number, status?: NyokkiStatus): void {
    if (order >= 10) return
    if (status === 'nyokki') {
      // 結果がNyokkiだった場合、順位に関係なくmissを出現させる。
      this.nyokkiIconActive.setTexture('miss')
      this.nyokkiIconActive.setAlpha(1)
      return
    }
    if (order === -1) {
      // yetをnyokkiに変える処理
      this.nyokkiIconActive.setTexture('miss')
      this.nyokkiIconActive.setAlpha(status === 'yet' ? 1 : 0)
    }

    if (order >= 4 && order < 10) {
      // 4位以下の人に、wallPaperを追加する処理
      this.successRankFrame.setTexture('rankFrame')
      this.successRankFrame.setAlpha(status === 'success' ? 1 : 0)
    }

    const iconKey = order <= 3 ? `rank${order}` : `number${order}`
    this.successIconActive.setTexture(iconKey)
    this.successIconActive.setAlpha(status === 'success' ? 1 : 0)
  }

  public resetStatusIcon(): void {
    this.successIconActive.setAlpha(0)
    this.successRankFrame.setAlpha(0)
    this.nyokkiIconActive.setAlpha(0)
  }
}
