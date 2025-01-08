import { IMainScene, Store, DomManager, makeLayerHigherTemporary, domLayerSetting } from 'churaverse-engine-client'
import { IGameUiComponent } from '@churaverse/game-plugin-client/interface/IGameUiComponent'
// import { SendBetCoinEvent } from '../../event/sendBetCoinEvent'
import { SendBetCoinMessage } from '../../message/sendBetCoinMessage'
import { BetCoinForm } from './component/BetCoinForm'

// ベットコイン枚数入力部分
export const BET_COIN_INPUT_FIELD_ID = 'bet-coin-input-field'

// ベットコインの枚数増加ボタン
export const BET_COIN_INCREMENT_BUTTON_ID = 'bet-coin-increment'

// ベットコインの枚数減少ボタン
export const BET_COIN_DECREMENT_BUTTON_ID = 'bet-coin-decrement'

// ベットコイン送信ボタン
export const BET_COIN_SEND_BUTTON_ID = 'bet-coin-send-button'

export class BetCoinFormContainer implements IGameUiComponent {
  public element!: HTMLElement
  private betCoinInputField!: HTMLInputElement
  private coinsHeld = 100

  public readonly visible: boolean = false

  public constructor(private readonly store: Store<IMainScene>) {}

  public initialize(): void {
    this.setBetCoinFormContainer()
    const playerId = this.store.of('playerPlugin').ownPlayerId
    this.setUpInputFields(playerId)
  }

  private setUpInputFields(playerId: string): void {
    this.betCoinInputField = DomManager.getElementById<HTMLInputElement>(BET_COIN_INPUT_FIELD_ID)

    const sendButton = DomManager.getElementById(BET_COIN_SEND_BUTTON_ID)
    sendButton.onclick = () => {
      if (this.betCoinInputField.value !== '') {
        const betCoins = Number(this.betCoinInputField.value)
        this.store.of('networkPlugin').messageSender.send(new SendBetCoinMessage({ playerId, betCoins }))
        this.betCoinInputField.value = ''
        this.close()
      }
    }

    const maxBetCoins = 999
    const plusButton = DomManager.getElementById(BET_COIN_INCREMENT_BUTTON_ID)
    plusButton.onclick = () => {
      if (Number(this.betCoinInputField.value) >= this.coinsHeld || Number(this.betCoinInputField.value) >= maxBetCoins)
        return
      const value: number = Number(this.betCoinInputField.value)
      const incrementedNum: string = (value + 1).toString()
      this.betCoinInputField.value = incrementedNum
    }

    const minusButton = DomManager.getElementById(BET_COIN_DECREMENT_BUTTON_ID)
    minusButton.onclick = () => {
      if (Number(this.betCoinInputField.value) <= 0) return
      const value: number = Number(this.betCoinInputField.value)
      const decrementedNum: string = (value - 1).toString()
      this.betCoinInputField.value = decrementedNum
    }
  }

  public setBetCoinFormContainer(): void {
    this.element = DomManager.addJsxDom(BetCoinForm())
    domLayerSetting(this.element, 'lowest')
    this.element.addEventListener('click', () => {
      makeLayerHigherTemporary(this.element, 'lower')
    })
    this.close()
  }

  public setCoinsHeld(coinsHeld: number): void {
    this.coinsHeld = coinsHeld
  }

  public resetCoinsHeld(): void {
    const defaultCoins = 100
    this.coinsHeld = defaultCoins
  }

  public open(): void {
    this.element.style.display = 'flex'
    this.betCoinInputField.value = '0'
  }

  public close(): void {
    this.element.style.display = 'none'
  }

  public remove(): void {
    this.betCoinInputField.remove()
  }
}
