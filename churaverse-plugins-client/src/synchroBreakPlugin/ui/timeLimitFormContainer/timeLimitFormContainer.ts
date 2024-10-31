import {
  IMainScene,
  Store,
  IEventBus,
  DomManager,
  makeLayerHigherTemporary,
  domLayerSetting,
} from 'churaverse-engine-client'
import { NetworkPluginStore } from '@churaverse/network-plugin-client/store/defNetworkPluginStore'
import { TimeLimitForm } from './component/TimeLimitForm'
import { TimeLimitConfirmEvent } from '../../event/timeLimitConfirmEvent'
import { TimeLimitConfirmMessage } from '../../message/timeLimitConfirmMessage'

// 制限時間入力部分
export const TIME_LIMIT_INPUT_FIELD_ID = 'time-limit-input-field'

// 制限時間増加ボタン
export const TIME_LIMIT_INCREMENT_BUTTON_ID = 'time-limit-increment'

// 制限時間減少ボタン
export const TIME_LIMIT_DECREMENT_BUTTON_ID = 'time-limit-decrement'

// 制限時間確定ボタン
export const TIME_LIMIT_SEND_BUTTON_ID = 'time-limit-send-button'

export const MAX_TIME_LIMIT = '15'

export const MIN_TIME_LIMIT = '3'

export class TimeLimitFormContainer {
  private container!: HTMLElement
  private timeLimitInputField!: HTMLInputElement
  private readonly networkPluginStore!: NetworkPluginStore<IMainScene>

  public constructor(
    private readonly eventBus: IEventBus<IMainScene>,
    private readonly store: Store<IMainScene>
  ) {
    this.eventBus = eventBus
    this.setTimeLimitFormContainer()
    this.setUpInputFields()
    this.networkPluginStore = this.store.of('networkPlugin')

    // uiManagerにtimeLimitFormを追加
    store.of('synchroBreakPlugin').uiManager.addUi('timeLimit', this)

    // uiを非表示にする
    this.close()
  }

  public setTimeLimitFormContainer(): void {
    this.container = DomManager.addJsxDom(TimeLimitForm())
    domLayerSetting(this.container, 'lowest')
    this.container.addEventListener('click', () => {
      makeLayerHigherTemporary(this.container, 'lower')
    })
  }

  private setUpInputFields(): void {
    this.timeLimitInputField = DomManager.getElementById<HTMLInputElement>(TIME_LIMIT_INPUT_FIELD_ID)

    const sendButton = DomManager.getElementById(TIME_LIMIT_SEND_BUTTON_ID)
    const minTimeLimit = 3
    const maxTimeLimit = 15
    sendButton.onclick = () => {
      const timelineInputFieldValue = this.timeLimitInputField.value
      if (Number(timelineInputFieldValue) >= minTimeLimit && Number(timelineInputFieldValue) <= maxTimelimit) {
        const playerId = this.store.of('playerPlugin').ownPlayerId
        const timeLimitConfirmEvent = new TimeLimitConfirmEvent(playerId, timelineInputFieldValue)
        this.eventBus.post(timeLimitConfirmEvent)
        this.networkPluginStore.messageSender.send(
          new TimeLimitConfirmMessage({ playerId, timeLimit: timeLineInputFieldValue })
        )
        this.close()
      } else {
        this.timeLimitInputField.value = MIN_TIME_LIMIT
      }
    }

    const plusButton = DomManager.getElementById(TIME_LIMIT_INCREMENT_BUTTON_ID)
    plusButton.onclick = () => {
      const value: number = Number(this.timeLimitInputField.value)
      if (value < Number(MAX_TIME_LIMIT)) {
        const incrementedNum: string = (value + 1).toString()
        this.timeLimitInputField.value = incrementedNum
      }
    }

    const minusButton = DomManager.getElementById(TIME_LIMIT_DECREMENT_BUTTON_ID)
    minusButton.onclick = () => {
      if (Number(this.timeLimitInputField.value) <= 0) return
      const value: number = Number(this.timeLimitInputField.value)
      if (value > Number(MIN_TIME_LIMIT)) {
        const decrementedNum: string = (value - 1).toString()
        this.timeLimitInputField.value = decrementedNum
      }
    }
  }

  public open(): void {
    this.timeLimitInputField.value = '3'
    this.container.style.display = 'flex'
  }

  public close(): void {
    this.container.style.display = 'none'
  }

  public remove(): void {
    this.container.remove()
  }
}
