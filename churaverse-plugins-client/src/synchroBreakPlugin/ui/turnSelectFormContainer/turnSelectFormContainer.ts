import { IMainScene, Store, DomManager, domLayerSetting, makeLayerHigherTemporary } from 'churaverse-engine-client'
import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'
import { NetworkPluginStore } from '@churaverse/network-plugin-client/store/defNetworkPluginStore'
import { SelectTurnForm } from './component/SelectTurnForm'
import { NyokkiTurnSelectMessage } from '../../message/nyokkiTurnSelectMessage'

/**  turn入力部分 */
export const TURN_SELECT_FIELD_ID = 'turn-select-field-id'

/** turn数の増加部分 */
export const TURN_SELECT_INCREASE_BUTTON_ID = 'turn-select-increase'

/** turn数の減少部分 */
export const TURN_SELECT_DECREASE_BUTTON_ID = 'turn-select-decrease'

/** turn数送信ボタン */
export const TURN_SELECT_SEND_BUTTON_ID = 'turn-select-send'

export class TurnSelectFormContainer implements IGameUiComponent {
  public element!: HTMLElement
  public readonly visible = false
  private turnSelectInputField!: HTMLInputElement
  private readonly networkPluginStore!: NetworkPluginStore<IMainScene>

  private get inputFieldValue(): number {
    return Number(this.turnSelectInputField.value)
  }

  private set inputFieldValue(value: number) {
    this.turnSelectInputField.value = value.toString()
  }

  public constructor(public readonly store: Store<IMainScene>) {
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  public initialize(): void {
    this.element = DomManager.addJsxDom(SelectTurnForm())

    domLayerSetting(this.element, 'lowest')
    this.element.addEventListener('click', () => {
      makeLayerHigherTemporary(this.element, 'lower')
    })

    this.setupInputFields(this.store.of('playerPlugin').ownPlayerId)
  }

  /**
   * ターン数選択フォームの入力部分を設定する
   */
  private setupInputFields(playerId: string): void {
    this.turnSelectInputField = DomManager.getElementById<HTMLInputElement>(TURN_SELECT_FIELD_ID)

    const sendButton = DomManager.getElementById(TURN_SELECT_SEND_BUTTON_ID)
    sendButton.onclick = () => {
      this.networkPluginStore.messageSender.send(
        new NyokkiTurnSelectMessage({ playerId, allTurn: this.inputFieldValue })
      )
      this.inputFieldValue = 0
      this.close()
    }

    const plusButton = DomManager.getElementById(TURN_SELECT_INCREASE_BUTTON_ID)
    plusButton.onclick = () => {
      if (this.inputFieldValue >= 10) return
      this.inputFieldValue++
    }

    const minusButton = DomManager.getElementById(TURN_SELECT_DECREASE_BUTTON_ID)
    minusButton.onclick = () => {
      if (Number(this.inputFieldValue) <= 1) return
      this.inputFieldValue--
    }
  }

  public open(): void {
    this.inputFieldValue = 0
    this.element.style.display = 'flex'
  }

  public close(): void {
    this.element.style.display = 'none'
  }

  public remove(): void {
    this.turnSelectInputField.remove()
  }
}
