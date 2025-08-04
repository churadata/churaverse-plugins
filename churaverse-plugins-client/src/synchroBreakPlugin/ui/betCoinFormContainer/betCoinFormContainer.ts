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

// ベットコインの最小値と最大値
export const SYNCHRO_BREAK_MIN_BET_COIN: number = 0
export const SYNCHRO_BREAK_MAX_BET_COIN: number = 999

export class BetCoinFormContainer implements IGameUiComponent {
  public element!: HTMLElement
  public readonly visible: boolean = false
  private betCoinInputField!: HTMLInputElement

  public constructor(private readonly store: Store<IMainScene>) {}

  private get inputFieldValue(): number {
    const value = Number(this.betCoinInputField.value)
    return isNaN(value) ? SYNCHRO_BREAK_MIN_BET_COIN : value
  }

  private set inputFieldValue(value: number) {
    this.betCoinInputField.value = value.toString()
  }

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
      const ownPlayerCoins = this.store.of('synchroBreakPlugin').playersCoinRepository.get(ownPlayerId)
      const betCoins = this.inputFieldValue

      if (SYNCHRO_BREAK_MIN_BET_COIN <= betCoins && betCoins <= ownPlayerCoins) {
        this.store.of('networkPlugin').messageSender.send(new SendBetCoinMessage({ playerId: ownPlayerId, betCoins }))
        this.inputFieldValue = SYNCHRO_BREAK_MIN_BET_COIN
        this.close()
      } else {
        this.inputFieldValue = SYNCHRO_BREAK_MIN_BET_COIN
      }
    }

    const plusButton = DomManager.getElementById(BET_COIN_INCREMENT_BUTTON_ID)

    plusButton.onclick = () => {
      this.incrementBetCoin(ownPlayerId)
    }

    this.setupLongPress(plusButton, () => {
      this.incrementBetCoin(ownPlayerId)
    })

    const minusButton = DomManager.getElementById(BET_COIN_DECREMENT_BUTTON_ID)

    minusButton.onclick = () => {
      this.decrementBetCoin()
    }

    this.setupLongPress(minusButton, () => {
      this.decrementBetCoin()
    })
  }

  /**
   * ベットコインをインクリメントする
   */
  private incrementBetCoin(ownPlayerId: string): void {
    const ownPlayerCoins = this.store.of('synchroBreakPlugin').playersCoinRepository.get(ownPlayerId)
    const betCoins = this.inputFieldValue

    if (betCoins >= ownPlayerCoins || betCoins >= SYNCHRO_BREAK_MAX_BET_COIN) return
    this.inputFieldValue = betCoins + 1
  }

  /**
   * ベットコインをデクリメントする
   */
  private decrementBetCoin(): void {
    const betCoins = this.inputFieldValue

    if (betCoins <= SYNCHRO_BREAK_MIN_BET_COIN) return
    this.inputFieldValue = betCoins - 1
  }

  /**
   * ボタンの長押し機能を設定する
   */
  private setupLongPress(button: HTMLElement, action: () => void): void {
    let longPressTimer: number
    let longPressInterval: number

    const startLongPress = (): void => {
      longPressTimer = window.setTimeout(() => {
        longPressInterval = window.setInterval(() => {
          action()
        }, 100)
      }, 500)
    }

    const stopLongPress = (): void => {
      if (longPressTimer !== 0) {
        clearTimeout(longPressTimer)
        longPressTimer = 0
      }
      if (longPressInterval !== 0) {
        clearInterval(longPressInterval)
        longPressInterval = 0
      }
    }

    button.addEventListener('mousedown', startLongPress)
    button.addEventListener('mouseup', stopLongPress)
    button.addEventListener('mouseleave', stopLongPress)
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
  }

  public close(): void {
    this.element.style.display = 'none'
  }

  public remove(): void {
    this.betCoinInputField.remove()
  }
}
