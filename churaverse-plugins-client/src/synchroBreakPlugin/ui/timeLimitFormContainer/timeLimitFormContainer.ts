import { Store, IMainScene, DomManager, makeLayerHigherTemporary, domLayerSetting } from 'churaverse-engine-client'
import { NetworkPluginStore } from '@churaverse/network-plugin-client/store/defNetworkPluginStore'
import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'
import '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import '@churaverse/game-plugin-client/gameUiManager'
import { TimeLimitForm } from './component/TimeLimitForm'
import { TimeLimitConfirmMessage } from '../../message/timeLimitConfirmMessage'

/** 制限時間入力部分 */
export const TIME_LIMIT_INPUT_FIELD_ID = 'synchro-break-time-limit-input-field'

/** 制限時間増加ボタン */
export const TIME_LIMIT_INCREMENT_BUTTON_ID = 'synchro-break-time-limit-increment'

/** 制限時間減少ボタン */
export const TIME_LIMIT_DECREMENT_BUTTON_ID = 'synchro-break-time-limit-decrement'

/** 制限時間確定ボタン */
export const TIME_LIMIT_SEND_BUTTON_ID = 'synchro-break-time-limit-send-button'

// 制限時間の最大値と最小値
export const SYNCHRO_BREAK_MAX_TIME_LIMIT: number = 15
export const SYNCHRO_BREAK_MIN_TIME_LIMIT: number = 3

export class TimeLimitFormContainer implements IGameUiComponent {
  public element!: HTMLElement
  public visible: boolean = false
  private timeLimitInputField!: HTMLInputElement
  private readonly networkPluginStore!: NetworkPluginStore<IMainScene>

  public constructor(private readonly store: Store<IMainScene>) {
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  public initialize(): void {
    this.element = DomManager.addJsxDom(TimeLimitForm())
    this.timeLimitInputField = DomManager.getElementById<HTMLInputElement>(TIME_LIMIT_INPUT_FIELD_ID)
    domLayerSetting(this.element, 'lowest')
    this.element.addEventListener('click', () => {
      makeLayerHigherTemporary(this.element, 'lower')
    })
    this.setUpInputFields()
  }

  public get inputFieldValue(): number {
    const value = Number(this.timeLimitInputField.value)
    return isNaN(value) ? SYNCHRO_BREAK_MIN_TIME_LIMIT : value
  }

  public set inputFieldValue(value: number) {
    this.timeLimitInputField.value = value.toString()
  }

  /**
   * 制限時間入力部分を設定する
   */
  private setUpInputFields(): void {
    const sendButton = DomManager.getElementById(TIME_LIMIT_SEND_BUTTON_ID)
    sendButton.onclick = () => {
      const timeLimitValue = this.inputFieldValue

      if (timeLimitValue >= SYNCHRO_BREAK_MIN_TIME_LIMIT && timeLimitValue <= SYNCHRO_BREAK_MAX_TIME_LIMIT) {
        const playerId = this.store.of('playerPlugin').ownPlayerId
        this.networkPluginStore.messageSender.send(
          new TimeLimitConfirmMessage({ playerId, timeLimit: timeLimitValue.toString() })
        )
        this.close()
      } else {
        this.inputFieldValue = SYNCHRO_BREAK_MIN_TIME_LIMIT
      }
    }

    const plusButton = DomManager.getElementById(TIME_LIMIT_INCREMENT_BUTTON_ID)
    plusButton.onclick = () => {
      const timeLimitValue = this.inputFieldValue

      if (timeLimitValue >= SYNCHRO_BREAK_MAX_TIME_LIMIT) return
      this.inputFieldValue = timeLimitValue + 1
    }

    const minusButton = DomManager.getElementById(TIME_LIMIT_DECREMENT_BUTTON_ID)
    minusButton.onclick = () => {
      const timeLimitValue = this.inputFieldValue

      if (timeLimitValue <= SYNCHRO_BREAK_MIN_TIME_LIMIT) return
      this.inputFieldValue = timeLimitValue - 1
    }
  }

  public open(): void {
    this.element.style.display = 'flex'
    this.inputFieldValue = SYNCHRO_BREAK_MIN_TIME_LIMIT
  }

  public close(): void {
    this.element.style.display = 'none'
  }

  public remove(): void {
    this.timeLimitInputField.remove()
  }
}
