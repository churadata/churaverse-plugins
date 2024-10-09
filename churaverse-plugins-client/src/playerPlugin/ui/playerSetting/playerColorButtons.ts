import { IEventBus, IMainScene, DomManager } from 'churaverse-engine-client'
import { PLAYER_COLOR_NAMES, PlayerColor } from '../../types/playerColor'
import { PlayerColorButtonsComponent } from './components/PlayerColorButtonsComponent'
import { ISettingDialog } from '@churaverse/core-ui-plugin-client/interface/ISettingDialog'
import { PlayerColorChangeEvent } from '../../event/playerColorChangeEvent'

export const PLAYER_COLOR_BUTTON_ID: (colorName: PlayerColor) => string = (colorName) => {
  return `playerColorButton-${colorName}`
}

/**
 * プレイヤーの色を変更するボタン
 */
export class PlayerColorButtons {
  protected readonly playerId: string
  protected colorButtons = new Map<PlayerColor, HTMLInputElement>()

  protected constructor(
    playerId: string,
    selectedColor: PlayerColor,
    settingDialog: ISettingDialog,
    private readonly eventBus: IEventBus<IMainScene>
  ) {
    this.playerId = playerId

    const buttons = DomManager.jsxToDom(PlayerColorButtonsComponent({ defaultColor: selectedColor }))
    settingDialog.addContent('playerSetting', buttons)

    this.setupButtons()
  }

  public static build(
    playerId: string,
    selectedColor: PlayerColor,
    settingDialog: ISettingDialog,
    eventBus: IEventBus<IMainScene>
  ): PlayerColorButtons {
    return new PlayerColorButtons(playerId, selectedColor, settingDialog, eventBus)
  }

  private setupButtons(): void {
    PLAYER_COLOR_NAMES.forEach((color) => {
      const button = DomManager.getElementById<HTMLInputElement>(PLAYER_COLOR_BUTTON_ID(color))

      this.colorButtons.set(color, button)

      button.onclick = () => {
        this.onClick(color)
      }
    })
  }

  /**
   * ボタンクリック時に実行する関数
   */
  private onClick(color: PlayerColor): void {
    const changeColorEvent = new PlayerColorChangeEvent(this.playerId, color)
    this.eventBus.post(changeColorEvent)
  }
}
