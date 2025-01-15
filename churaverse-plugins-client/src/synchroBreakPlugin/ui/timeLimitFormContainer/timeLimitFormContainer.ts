import { Store, IMainScene, DomManager, makeLayerHigherTemporary, domLayerSetting } from 'churaverse-engine-client'
import { NetworkPluginStore } from '@churaverse/network-plugin-client/store/defNetworkPluginStore'
import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'
import '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import '@churaverse/game-plugin-client/gameUiManager'
import { TimeLimitForm } from './component/TimeLimitForm'
import { TimeLimitConfirmMessage } from '../../message/timeLimitConfirmMessage'

// 制限時間入力部分
export const TIME_LIMIT_INPUT_FIELD_ID = 'synchro-break-time-limit-input-field'

// 制限時間増加ボタン
export const TIME_LIMIT_INCREMENT_BUTTON_ID = 'synchro-break-time-limit-increment'

// 制限時間減少ボタン
export const TIME_LIMIT_DECREMENT_BUTTON_ID = 'synchro-break-time-limit-decrement'

// 制限時間確定ボタン
export const TIME_LIMIT_SEND_BUTTON_ID = 'synchro-break-time-limit-send-button'

// 制限時間の最大値と最小値
export const SYNCHRO_BREAK_MAX_TIME_LIMIT: number = 15
export const SYNCHRO_BREAK_MIN_TIME_LIMIT: number = 3

export class TimeLimitFormContainer implements IGameUiComponent {
  public element!: HTMLElement
  public visible: boolean = true
  private timeLimitInputField!: HTMLInputElement
  private readonly networkPluginStore!: NetworkPluginStore<IMainScene>

  public constructor(private readonly store: Store<IMainScene>) {
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  public initialize(): void {
    this.element = DomManager.addJsxDom(TimeLimitForm())
    domLayerSetting(this.element, 'lowest')
    this.element.addEventListener('click', () => {
      makeLayerHigherTemporary(this.element, 'lower')
    })
    this.setUpInputFields()
  }

  private setUpInputFields(): void {
    this.timeLimitInputField = DomManager.getElementById<HTMLInputElement>(TIME_LIMIT_INPUT_FIELD_ID)

    const sendButton = DomManager.getElementById(TIME_LIMIT_SEND_BUTTON_ID)
    sendButton.onclick = () => {
      const timelineInputFieldValue = this.timeLimitInputField.value
      if (
        Number(timelineInputFieldValue) >= SYNCHRO_BREAK_MIN_TIME_LIMIT &&
        Number(timelineInputFieldValue) <= SYNCHRO_BREAK_MAX_TIME_LIMIT
      ) {
        const playerId = this.store.of('playerPlugin').ownPlayerId
        this.networkPluginStore.messageSender.send(
          new TimeLimitConfirmMessage({ playerId, timeLimit: timelineInputFieldValue })
        )
        this.close()
      } else {
        this.timeLimitInputField.value = SYNCHRO_BREAK_MIN_TIME_LIMIT.toString()
      }
    }

    const plusButton = DomManager.getElementById(TIME_LIMIT_INCREMENT_BUTTON_ID)
    plusButton.onclick = () => {
      const value: number = Number(this.timeLimitInputField.value)
      if (value < SYNCHRO_BREAK_MAX_TIME_LIMIT) {
        const incrementedNum: string = (value + 1).toString()
        this.timeLimitInputField.value = incrementedNum
      }
    }

    const minusButton = DomManager.getElementById(TIME_LIMIT_DECREMENT_BUTTON_ID)
    minusButton.onclick = () => {
      if (Number(this.timeLimitInputField.value) <= 0) return
      const value: number = Number(this.timeLimitInputField.value)
      if (value > SYNCHRO_BREAK_MIN_TIME_LIMIT) {
        const decrementedNum: string = (value - 1).toString()
        this.timeLimitInputField.value = decrementedNum
      }
    }
  }

  public open(): void {
    this.timeLimitInputField.value = SYNCHRO_BREAK_MIN_TIME_LIMIT.toString()
    this.element.style.display = 'flex'
  }

  public close(): void {
    this.element.style.display = 'none'
  }

  public remove(): void {
    this.timeLimitInputField.remove()
  }
}
