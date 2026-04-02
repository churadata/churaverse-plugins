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

      //インジケーター更新
      const count = (this.textField?.value ?? '').length
      const MAX_COUNT = 15
      const meter = document.getElementById('title-name-meter')
      const countText = document.getElementById('title-name-count')
      if (meter !== null) {
        const offset = Math.max(0, 100 - (count / MAX_COUNT) * 100)
        meter.style.strokeDashoffset = String(offset)
        meter.style.stroke = count > MAX_COUNT ? '#f44336' : '#4caf50' 
      }
      if (countText !== null) {
        countText.textContent = String(count)
      }
    }
  }

  public getName(): string {
    return this.textField?.value ?? ''
  }

  public validate(): string[] {
    const name = this.getName()?.trim()
    const errors: string[] = []
    //名前の長さが15文字以下かを判定（全角・半角問わず）
    if (name.length === 0 || name.length > 15) {
      errors.push('名前は1文字以上15文字以下で入力してください')
    }
    //名前の途中で2つ以上の連続したスペースがあるかを判定
    if (/\s{2,}/.test(name)) {
      errors.push('名前に連続したスペースを含めないでください')
    }
    return errors
  }
}
