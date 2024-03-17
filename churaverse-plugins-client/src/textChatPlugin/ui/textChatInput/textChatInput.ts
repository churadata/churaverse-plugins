import { TextChatDialog } from '../textChatDialog/textChatDialog'
import { IEventBus, IMainScene, DomManager } from 'churaverse-engine-client'
import { TextChatInputComponent } from './components/TextChatInputComponent'
import { SendTextChatEvent } from '../../event/sendTextChatEvent'
import { TextChat } from '../../model/textChat'
import { IChatInputRenderer } from './IChatInputRenderer'

/**
 * チャット送信ボタンのid
 */
export const TEXT_CHAT_SEND_BUTTON_ID = 'chat-send-button'

/**
 * テキスト入力部分のid
 */
export const TEXT_CHAT_INPUT_FIELD_ID = 'chat-text-field'

/**
 * チャット入力部分
 */
export class TextChatInput implements IChatInputRenderer {
  private isFocused = false
  private readonly inputField: HTMLInputElement
  public constructor(
    private readonly playerId: string,
    private readonly name: string,
    textChatDialog: TextChatDialog,
    private readonly eventBus: IEventBus<IMainScene>
  ) {
    textChatDialog.directlyAddContent(DomManager.addJsxDom(TextChatInputComponent()))
    this.playerId = playerId
    // チャット入力部分の定義
    this.inputField = DomManager.getElementById<HTMLInputElement>(TEXT_CHAT_INPUT_FIELD_ID)
    this.inputField.addEventListener('click', (event) => {
      this.isFocused = true
      // このイベントが実行された際に親ノードのid=gameのonClick()が実行されないようにするため。
      event.stopPropagation()
    })

    // 送信ボタンが押された時、playerIdとmessageを受け渡している
    const sendButon = DomManager.getElementById(TEXT_CHAT_SEND_BUTTON_ID)
    if (sendButon !== null) {
      sendButon.onclick = () => {
        if (this.inputField.value !== '') {
          const message = this.inputField.value
          this.inputField.value = ''
          const sendTextChatEvent = new SendTextChatEvent(new TextChat(this.playerId, this.name, message))
          this.eventBus.post(sendTextChatEvent)
        }
      }
    }

    // チャット外にFocusがあった時に、チャットのFocusを外れるようにしている
    const gameElement = document.getElementById('game')
    if (gameElement != null) {
      gameElement.onclick = () => {
        if (this.isFocused) {
          this.blurInput()
        }
      }
    }
  }

  // 入力フィールドのフォーカスを外す
  private blurInput(): void {
    this.inputField.blur()
    this.isFocused = false
  }

  public getMessage(): string {
    return this.inputField.value
  }

  public clearMessage(): void {
    this.inputField.value = ''
  }
}
