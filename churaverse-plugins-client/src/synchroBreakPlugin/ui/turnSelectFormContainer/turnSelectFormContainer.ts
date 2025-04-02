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

  public constructor(public readonly store: Store<IMainScene>) {
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  public initialize(): void {
    this.element = DomManager.addJsxDom(SelectTurnForm())

    domLayerSetting(this.element, 'lowest')
    this.element.addEventListener('click', () => {
      makeLayerHigherTemporary(this.element, 'lower')
    })

    this.setUpInputFields(this.store.of('playerPlugin').ownPlayerId)
  }

  /**
   * ターン数選択フォームの入力部分を設定する
   */
  private setUpInputFields(playerId: string): void {
    this.turnSelectInputField = DomManager.getElementById<HTMLInputElement>(TURN_SELECT_FIELD_ID)

    const sendButton = DomManager.getElementById(TURN_SELECT_SEND_BUTTON_ID)
    sendButton.onclick = () => {
      if (this.turnSelectInputField.value !== '') {
        const turnNumber = Number(this.turnSelectInputField.value)
        this.networkPluginStore.messageSender.send(new NyokkiTurnSelectMessage({ playerId, allTurn: turnNumber }))

        this.turnSelectInputField.value = ''
        this.close()
      }
    }

    const plusButton = DomManager.getElementById(TURN_SELECT_INCREASE_BUTTON_ID)
    plusButton.onclick = () => {
      const value: number = Number(this.turnSelectInputField.value)
      if (value >= 10) return
      const incrementedNum: string = (value + 1).toString()
      this.turnSelectInputField.value = incrementedNum
    }

    const minusButton = DomManager.getElementById(TURN_SELECT_DECREASE_BUTTON_ID)
    minusButton.onclick = () => {
      if (Number(this.turnSelectInputField.value) <= 1) return
      const value: number = Number(this.turnSelectInputField.value)
      const decrementedNum: string = (value - 1).toString()
      this.turnSelectInputField.value = decrementedNum
    }
  }

  public open(): void {
    this.turnSelectInputField.value = '1'
    this.element.style.display = 'flex'
  }

  public close(): void {
    this.element.style.display = 'none'
  }

  public remove(): void {
    this.turnSelectInputField.remove()
  }
}
