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

// ターン数の最大値と最小値
export const SYNCHRO_BREAK_MAX_TURN_SELECT: number = 10
export const SYNCHRO_BREAK_MIN_TURN_SELECT: number = 1

export class TurnSelectFormContainer implements IGameUiComponent {
  public element!: HTMLElement
  public readonly visible = false
  private turnSelectInputField!: HTMLInputElement
  private readonly networkPluginStore!: NetworkPluginStore<IMainScene>

  public constructor(public readonly store: Store<IMainScene>) {
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  public initialize(): void {
    this.setTurnSelectFormContainer()
    this.turnSelectInputField = DomManager.getElementById<HTMLInputElement>(TURN_SELECT_FIELD_ID)
    this.setUpInputFields(this.store.of('playerPlugin').ownPlayerId)
  }

  public get inputFieldValue(): number {
    const value = Number(this.turnSelectInputField.value)
    return isNaN(value) ? SYNCHRO_BREAK_MIN_TURN_SELECT : value
  }

  public set inputFieldValue(value: number) {
    this.turnSelectInputField.value = value.toString()
  }

  /**
   * ターン数選択フォームの入力部分を設定する
   */
  private setUpInputFields(playerId: string): void {
    const sendButton = DomManager.getElementById(TURN_SELECT_SEND_BUTTON_ID)
    sendButton.onclick = () => {
      const turnNumber = this.inputFieldValue

      if (turnNumber >= SYNCHRO_BREAK_MIN_TURN_SELECT && turnNumber <= SYNCHRO_BREAK_MAX_TURN_SELECT) {
        this.networkPluginStore.messageSender.send(new NyokkiTurnSelectMessage({ playerId, allTurn: turnNumber }))

        this.inputFieldValue = SYNCHRO_BREAK_MIN_TURN_SELECT
        this.close()
      } else {
        this.inputFieldValue = SYNCHRO_BREAK_MIN_TURN_SELECT
      }
    }

    const plusButton = DomManager.getElementById(TURN_SELECT_INCREASE_BUTTON_ID)
    plusButton.onclick = () => {
      const turnNumber = this.inputFieldValue

      if (turnNumber >= SYNCHRO_BREAK_MAX_TURN_SELECT) return
      this.inputFieldValue = turnNumber + 1
    }

    const minusButton = DomManager.getElementById(TURN_SELECT_DECREASE_BUTTON_ID)
    minusButton.onclick = () => {
      const turnNumber = this.inputFieldValue

      if (turnNumber <= SYNCHRO_BREAK_MIN_TURN_SELECT) return
      this.inputFieldValue = turnNumber - 1
    }
  }

  private setTurnSelectFormContainer(): void {
    this.element = DomManager.addJsxDom(SelectTurnForm())
    domLayerSetting(this.element, 'lowest')
    this.element.addEventListener('click', () => {
      makeLayerHigherTemporary(this.element, 'lower')
    })
    this.close()
  }

  public open(): void {
    this.element.style.display = 'flex'
  }

  public close(): void {
    this.element.style.display = 'none'
  }

  public remove(): void {
    this.turnSelectInputField.remove()
  }
}
