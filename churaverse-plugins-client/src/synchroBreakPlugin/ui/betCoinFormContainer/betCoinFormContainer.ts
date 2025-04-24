import { IMainScene, Store, DomManager, makeLayerHigherTemporary, domLayerSetting } from 'churaverse-engine-client'
import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'
import { SendBetCoinMessage } from '../../message/sendBetCoinMessage'
import { BetCoinForm } from './component/BetCoinForm'

/** ベットコイン枚数入力部分 */
export const BET_COIN_INPUT_FIELD_ID = 'bet-coin-input-field'

/** ベットコインの枚数増加ボタン */
export const BET_COIN_INCREMENT_BUTTON_ID = 'bet-coin-increment'

/** ベットコインの枚数減少ボタン */
export const BET_COIN_DECREMENT_BUTTON_ID = 'bet-coin-decrement'

/** ベットコイン送信ボタン */
export const BET_COIN_SEND_BUTTON_ID = 'bet-coin-send-button'

export class BetCoinFormContainer implements IGameUiComponent {
  public element!: HTMLElement
  public readonly visible: boolean = false
  private betCoinInputField!: HTMLInputElement

  private get inputFieldValue(): number {
    return Number(this.betCoinInputField.value)
  }

  private set inputFieldValue(value: number) {
    this.betCoinInputField.value = value.toString()
  }

  public constructor(private readonly store: Store<IMainScene>) {}

  public initialize(): void {
    this.setBetCoinFormContainer()
    const ownPlayerId = this.store.of('playerPlugin').ownPlayerId
    this.setupInputFields(ownPlayerId)
  }

  /**
   * ベットコインの入力部分を設定する
   */
  private setupInputFields(ownPlayerId: string): void {
    this.betCoinInputField = DomManager.getElementById<HTMLInputElement>(BET_COIN_INPUT_FIELD_ID)

    const sendButton = DomManager.getElementById(BET_COIN_SEND_BUTTON_ID)
    sendButton.onclick = () => {
      this.store
        .of('networkPlugin')
        .messageSender.send(new SendBetCoinMessage({ playerId: ownPlayerId, betCoins: this.inputFieldValue }))
      this.inputFieldValue = 0
      this.close()
    }

    // ベットコインの最大値
    const maxBetCoins = 999

    const plusButton = DomManager.getElementById(BET_COIN_INCREMENT_BUTTON_ID)
    plusButton.onclick = () => {
      const ownPlayerCoins = this.store.of('synchroBreakPlugin').playersCoinRepository.get(ownPlayerId)

      if (this.inputFieldValue >= ownPlayerCoins || this.inputFieldValue >= maxBetCoins) return

      this.inputFieldValue++
    }

    const minusButton = DomManager.getElementById(BET_COIN_DECREMENT_BUTTON_ID)
    minusButton.onclick = () => {
      if (this.inputFieldValue <= 0) return
      this.inputFieldValue--
    }
  }

  private setBetCoinFormContainer(): void {
    this.element = DomManager.addJsxDom(BetCoinForm())
    domLayerSetting(this.element, 'lowest')
    this.element.addEventListener('click', () => {
      makeLayerHigherTemporary(this.element, 'lower')
    })
    this.close()
  }

  public open(): void {
    this.element.style.display = 'flex'
    this.inputFieldValue = 0
  }

  public close(): void {
    this.element.style.display = 'none'
  }

  public remove(): void {
    this.betCoinInputField.remove()
  }
}
