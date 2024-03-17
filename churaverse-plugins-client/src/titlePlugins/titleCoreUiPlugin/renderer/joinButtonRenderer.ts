import { ITitleScene, Store, IEventBus, createUIContainer, DomManager } from 'churaverse-engine-client'
import { GameObjects, Scene } from 'phaser'
import { IJoinButtonRenderer } from '../domain/IJoinButtonRenderer'
import { PlayerRole } from '../../../playerPlugin/types/playerRole'
import { TitlePlayerPluginStore } from '../../titlePlayerPlugin/store/defTitlePlayerPlugin'
import { TransitionPluginStore } from '../../../transitionPlugin/store/defTransitionPluginStore'

const BUTTON_COLOR = {
  /* eslint-disable */
  DEFAULT_COLOR: '#1292e2',
  MOUSEOVER_BUTTON_COLOR: '#64bbf2',
  /* eslint-enable */
}

const ADMIN_BUTTON_COLOR = {
  /* eslint-disable */
  DEFAULT_COLOR: '#e62ea2',
  MOUSEOVER_BUTTON_COLOR: '#ff66c7',
  /* eslint-enable */
}

/**
 * MainSceneに遷移するためのボタン. Titleで表示される
 */
export class JoinButtonRenderer implements IJoinButtonRenderer {
  private readonly joinButton: GameObjects.Text
  private readonly container: GameObjects.Container
  private joinButtonColor = BUTTON_COLOR
  private readonly titlePlayerPluginStore: TitlePlayerPluginStore
  private readonly transitionPluginStore: TransitionPluginStore<ITitleScene>

  public constructor(scene: Scene, store: Store<ITitleScene>, private readonly eventBus: IEventBus<ITitleScene>) {
    this.titlePlayerPluginStore = store.of('titlePlayerPlugin')
    this.transitionPluginStore = store.of('transitionPlugin')

    const buttonWidth = 40
    const buttonHeight = 20

    this.joinButton = scene.add
      .text(0, 0, 'Join')
      .setOrigin(0.5)
      .setPadding(buttonWidth, buttonHeight)
      .setStyle({ backgroundColor: this.joinButtonColor.DEFAULT_COLOR, align: 'center' })
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        this.onMouseover()
      })
      .on('pointerout', () => {
        this.onMouseout()
      })
      .on('pointerdown', () => {
        this.onClick()
      })

    this.container = createUIContainer(scene, 0.5, 0.62)
    this.container.add(this.joinButton)
    this.changeButtonColor(this.titlePlayerPluginStore.ownPlayer.role)
  }

  // 管理者のときと一般ユーザのときでjoinボタンの色を変更する
  public changeButtonColor(role: PlayerRole): void {
    if (role === 'admin') {
      this.joinButtonColor = ADMIN_BUTTON_COLOR
      this.joinButton.setStyle({ backgroundColor: ADMIN_BUTTON_COLOR.DEFAULT_COLOR, align: 'center' })
    } else {
      this.joinButtonColor = BUTTON_COLOR
      this.joinButton.setStyle({ backgroundColor: BUTTON_COLOR.DEFAULT_COLOR, align: 'center' })
    }
  }

  /** マウスオーバーした時の動作 */
  private onMouseover(): void {
    // ボタンの色を明るくする
    this.joinButton.setStyle({ backgroundColor: this.joinButtonColor.MOUSEOVER_BUTTON_COLOR })
  }

  /** マウスアウトした時の動作 */
  private onMouseout(): void {
    // ボタンの色を元に戻す
    this.joinButton.setStyle({ backgroundColor: this.joinButtonColor.DEFAULT_COLOR })
  }

  /** buttonが押されたときの動作 */
  private onClick(): void {
    const validateResult = this.titlePlayerPluginStore.titleNameFieldRenderer.validate() ?? false

    if (validateResult) {
      // 処理が重複しないように処理中はボタンを押せないようにロック
      this.joinButton.disableInteractive()

      // MainSceneに遷移
      DomManager.removeAll()
      this.transitionPluginStore.transitionManager.transitionTo('MainScene')
    } else {
      alert('空文字列、空白文字列のみの名前は利用できません')
    }
  }
}
