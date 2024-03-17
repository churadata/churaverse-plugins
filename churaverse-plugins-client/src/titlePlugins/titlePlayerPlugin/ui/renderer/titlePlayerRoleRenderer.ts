import { GameObjects, Scene } from 'phaser'
import { ITitlePlayerRoleRenderer } from '../../domain/ITitlePlayerRoleRenderer'
import { createUIContainer } from 'churaverse-engine-client'
import { PlayerSetupInfoReader } from '../../../../../interface/playerSetupInfo/playerSetupInfoReader'

export class TitlePlayerRoleRenderer implements ITitlePlayerRoleRenderer {
  private readonly container: GameObjects.Container
  public constructor(scene: Scene, playerSetupInfoReader: PlayerSetupInfoReader) {
    const playerRole = playerSetupInfoReader.read().role ?? 'user'
    const adminLabel = scene.add.text(0, 0, 'your role: admin', {
      color: '0x000000',
    })
    adminLabel.setOrigin(1, 0)
    this.container = createUIContainer(scene, 1, 0, -10, 10)
    this.container.add(adminLabel)
    if (playerRole === 'admin') {
      this.appear()
    } else {
      this.disappear()
    }
  }

  // タイトル画面右上にadminを表示
  public appear(): void {
    this.container.setVisible(true)
  }

  // タイトル画面右上のadmin表示を隠す
  public disappear(): void {
    this.container.setVisible(false)
  }
}
