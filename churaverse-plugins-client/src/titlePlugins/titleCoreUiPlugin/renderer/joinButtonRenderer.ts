import { ITitleScene, Store, IEventBus, createUIContainer, DomManager, SceneName } from 'churaverse-engine-client'
import { GameObjects, Scene } from 'phaser'
import { IJoinButtonRenderer } from '../domain/IJoinButtonRenderer'
import { PlayerRole } from '@churaverse/player-plugin-client/types/playerRole'
import { TitlePlayerPluginStore } from '../../titlePlayerPlugin/store/defTitlePlayerPlugin'
import { TransitionPluginStore } from '@churaverse/transition-plugin-client/store/defTransitionPluginStore'
import { GameModeSelectorRenderer } from './gameModeSelectorRenderer'

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

export class JoinButtonRenderer implements IJoinButtonRenderer {
  private readonly joinButton: GameObjects.Text
  private readonly container: GameObjects.Container
  private joinButtonColor = BUTTON_COLOR
  private readonly titlePlayerPluginStore: TitlePlayerPluginStore
  private readonly transitionPluginStore: TransitionPluginStore<ITitleScene>
  private readonly gameModeSelectorRenderer: GameModeSelectorRenderer

  public constructor(scene: Scene, store: Store<ITitleScene>, private readonly eventBus: IEventBus<ITitleScene>) {
    this.titlePlayerPluginStore = store.of('titlePlayerPlugin')
    this.transitionPluginStore = store.of('transitionPlugin')
    this.gameModeSelectorRenderer = new GameModeSelectorRenderer(this.eventBus)

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

  public changeButtonColor(role: PlayerRole): void {
    if (role === 'admin') {
      this.joinButtonColor = ADMIN_BUTTON_COLOR
      this.joinButton.setStyle({ backgroundColor: ADMIN_BUTTON_COLOR.DEFAULT_COLOR, align: 'center' })
    } else {
      this.joinButtonColor = BUTTON_COLOR
      this.joinButton.setStyle({ backgroundColor: BUTTON_COLOR.DEFAULT_COLOR, align: 'center' })
    }
  }

  private onMouseover(): void {
    this.joinButton.setStyle({ backgroundColor: this.joinButtonColor.MOUSEOVER_BUTTON_COLOR })
  }

  private onMouseout(): void {
    this.joinButton.setStyle({ backgroundColor: this.joinButtonColor.DEFAULT_COLOR })
  }

  private onClick(): void {
    const validateResult = this.titlePlayerPluginStore.titleNameFieldRenderer.validate() ?? false

    if (validateResult) {
      this.joinButton.disableInteractive()

      const targetScene: SceneName = this.gameModeSelectorRenderer.isGameModeEnabled()
        ? 'MainScene'
        : 'MeetingScene'

      DomManager.removeAll()
      this.transitionPluginStore.transitionManager.transitionTo(targetScene)
    } else {
      alert('名前は1文字以上15文字以内で入力してください')
    }
  }
}
