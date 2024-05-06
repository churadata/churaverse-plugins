import { IEventBus, IMainScene, DomManager } from 'churaverse-engine-client'
import { RenameFormComponent } from './components/RenameComponent'
import { ISettingDialog } from '@churaverse/core-ui-plugin-client/interface/ISettingDialog'
import { PlayerNameChangeEvent } from '../../event/playerNameChangeEvent'

/**
 * 名前入力フォーム内にあるテキストフィールド要素のname
 */
export const TEXT_FIELD_ID = 'name-field'

/**
 * 名前入力フォーム内にある決定ボタン要素のname
 */
export const SEND_BUTTON_ID = 'name-send-button'

/**
 * プレイヤー名変更欄
 */
export class RenameForm {
  private readonly playerId: string

  public constructor(
    playerId: string,
    name: string,
    settingDialog: ISettingDialog,
    private readonly eventBus: IEventBus<IMainScene>
  ) {
    this.playerId = playerId

    const content = DomManager.jsxToDom(RenameFormComponent({ defaultName: name }))
    settingDialog.addContent('playerSetting', content)

    const textField = this.setupTextField()
    this.setupSendButton(textField)
  }

  public static build(
    playerId: string,
    defaultName: string,
    settingDialog: ISettingDialog,
    eventBus: IEventBus<IMainScene>
  ): RenameForm {
    return new RenameForm(playerId, defaultName, settingDialog, eventBus)
  }

  private setupTextField(): HTMLInputElement {
    const textField = DomManager.getElementById<HTMLInputElement>(TEXT_FIELD_ID)

    return textField
  }

  /**
   * 決定ボタンを押下した時の挙動を設定する
   */
  private setupSendButton(textField: HTMLInputElement): void {
    const sendButton = DomManager.getElementById(SEND_BUTTON_ID)

    sendButton.onclick = () => {
      // 入力欄の文字列を取得
      const name = textField.value
      if (name !== '') {
        // プレイヤーの名前を変更する
        const changeNameEvent = new PlayerNameChangeEvent(this.playerId, name)
        this.eventBus.post(changeNameEvent)
      }
    }
  }
}
