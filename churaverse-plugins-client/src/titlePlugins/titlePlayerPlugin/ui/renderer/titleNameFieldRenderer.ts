import { IEventBus, ITitleScene, DomManager } from 'churaverse-engine-client'
import { TitlePlayerNameChangeEvent } from '../../event/titlePlayerNameChangeEvent'
import { ITitleNameFieldRenderer } from '../../domain/ITitleNameFieldRenderer'
import { TitleNameFieldComponent } from '../components/TitleNameFieldComponent'

/**
 * 名前入力フォーム内にあるテキストフィールド要素のname
 */
const TITLE_FIELD_NAME = 'title-name-field'

export class TitleNameFieldRenderer implements ITitleNameFieldRenderer {
  /**
   * 名前入力欄
   */
  private readonly textField?: HTMLInputElement

  public constructor(private readonly eventBus: IEventBus<ITitleScene>) {
    // 名前入力欄の生成
    DomManager.addJsxDom(TitleNameFieldComponent())
    this.textField = DomManager.getElementById<HTMLInputElement>(TITLE_FIELD_NAME)
    // 入力時の動作
    this.textField.oninput = () => {
      const changeNameEvent = new TitlePlayerNameChangeEvent(this.getName())
      this.eventBus.post(changeNameEvent)
    }
  }

  public getName(): string {
    return this.textField?.value ?? ''
  }

  public validate(): boolean {
    const name = this.getName()?.trim()
    // 名前の文字列が空白文字のみまたは空文字のみでないかを判定
    if (name === '') {
      return false
    }
    //名前の長さが15文字以下かを判定（全角・半角問わず）
    if (name.length > 15) {
      return false
    }
    return true
  }
}
