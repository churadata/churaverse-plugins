import { DomManager, domLayerSetting } from 'churaverse-engine-client'
import { DescriptionWindowComponent } from './component/DescriptionWindowComponent'
import '@churaverse/game-plugin-client/gameUiManager'
import { IDescriptionWindow } from '../../interface/IDescriptionWindow'

export const SYNCHRO_BREAK_DESCRIPTION_TEXT_ID = 'synchro-break-description-text'

export class DescriptionWindow implements IDescriptionWindow {
  public element!: HTMLElement
  public visible: boolean = false
  private descriptionText: string = ''
  private descriptionTextElement: HTMLElement | null = null
  private gameName: string = 'ゲーム'
  private gameOwnerName: string = 'ゲームオーナー'

  public initialize(): void {
    this.element = DomManager.addJsxDom(DescriptionWindowComponent({ description: this.descriptionText }))
    this.descriptionTextElement = DomManager.getElementById(SYNCHRO_BREAK_DESCRIPTION_TEXT_ID)
    domLayerSetting(this.element, 'lowest')
  }

  public remove(): void {
    this.descriptionText = ''
    this.descriptionTextElement = null
  }

  public close(): void {
    this.element.style.display = 'none'
  }

  public setGameBaseInfo(gameName: string, ownerName: string): void {
    this.gameName = gameName
    this.gameOwnerName = ownerName
  }

  /**
   * ゲーム開始時主催者サイドの文章更新処理
   */
  public displayGameStartForOwner(): void {
    this.setDescriptionText(
      `${this.gameName}を開始しました。<br>あなたはゲームの管理者です。 <br>ターン数(1~10)を選択してください。`
    )
    this.open()
  }

  /**
   * ゲーム開始時参加者サイドの文章更新処理
   */
  public displayGameStartForGuest(): void {
    this.setDescriptionText(`${this.gameName}が開始されました！<br>${this.gameOwnerName}さんがターンを入力中です。`)
    this.open()
  }

  /**
   * ターン選択後の文章更新処理
   * @param turn 選択されたターン数
   */
  public displayTurnSelectionForOwner(turn: number): void {
    this.setDescriptionText(`${turn}ターン選択しました。<br>制限時間(3~15)を選択してください。`)
  }

  /**
   * ターン選択後の制限時間入力待ち文章更新処理
   * @param turn 選択されたターン数
   */
  public displayTurnSelectionForGuest(turn: number): void {
    this.setDescriptionText(`${turn}ターン選択しました。<br>${this.gameOwnerName}さんが制限時間を入力中です。`)
  }

  /**
   * 主催者サイドの制限時間入力後の文章更新処理
   * @param timeLimit 選択された制限時間
   */
  public displayTimeLimitSelectionForOwner(timeLimit: string, ownCoins: number): void {
    this.setDescriptionText(
      `制限時間を${timeLimit}秒選択しました。<br>ベットコインを入力してください。<br>所持コイン数:${ownCoins}`
    )
  }

  /**
   * 参加者サイドの制限時間入力後の文章更新処理
   * @param timeLimit 選択された制限時間
   */
  public displayTimeLimitSelectionForGuest(timeLimit: string, ownCoins: number): void {
    this.setDescriptionText(
      `制限時間が${timeLimit}秒選択されました。<br>ベットコインを入力してください。<br>所持コイン数:${ownCoins}`
    )
  }

  /**
   * ベットコイン選択後の文章更新処理
   * @param betCoins 選択されたベットコイン数
   */
  public displayBetCoinSelection(betCoins: number): void {
    this.setDescriptionText(`ベットコインを${betCoins}枚選択しました。<br>相手のベットコインを待っています。`)
  }

  /**
   * ゲーム開始カウントダウンの文章更新処理
   * @param countdown ゲーム開始までのカウントダウン
   */
  public displayGameStartCountdown(countdown: number): void {
    this.setDescriptionText(`ゲーム開始まで<br>${countdown}秒`)
  }

  /**
   * シンクロブレイク開始の文章更新処理
   * @param timeLimit シンクロブレイクの制限時間
   */
  public displaySynchroBreakStart(timeLimit: number): void {
    this.setDescriptionText(`${this.gameName}開始！！！<br>残り${timeLimit}秒以内にボタンを押してください！`)
  }

  /**
   * シンクロブレイク進行中の文章更新処理
   * @param countdown シンクロブレイク終了までのカウントダウン
   */
  public displaySynchroBreakInProgress(countdown: number, playerName?: string, nyokkiActionMessage?: string): void {
    const descriptionText = [`現在${this.gameName}進行中`, `残り${countdown}秒以内にボタンを押してください！`]
    if (playerName !== undefined && nyokkiActionMessage !== undefined) {
      descriptionText.splice(1, 0, nyokkiActionMessage)
    }

    this.setDescriptionText(descriptionText.join('<br>'))
  }

  /**
   * シンクロブレイク終了の文章更新処理
   */
  public displaySynchroBreakEnd(): void {
    this.setDescriptionText(`${this.gameName}終了！！！`)
  }

  /**
   * ターン終了の文章更新処理
   * @param turnNumber 残りターン数
   */
  public displayTurnStart(turnNumber: number, ownCoins: number): void {
    this.setDescriptionText(
      `残り${turnNumber}ターンです。<br>ベットコインを入力してください。<br>所持コイン数:${ownCoins}`
    )
  }

  /**
   * ニョッキアクションの文章更新処理
   * @param text ニョッキアクションの文章
   */
  public displayNyokkiAction(text: string): void {
    const descriptionText = this.element.innerHTML.split('<br>')
    descriptionText.splice(1, 0, text)
    this.setDescriptionText(descriptionText.join('<br>'))
  }

  /**
   * 結果ウィンドウ表示時のメッセージ表示
   */
  public displayResultMessage(): void {
    this.setDescriptionText(
      '〜最終ランキング〜</br>お疲れ様でした。</br>閉じるボタンを押すと通常のちゅらバースに戻ります。'
    )
  }

  private open(): void {
    this.element.style.display = 'flex'
  }

  /**
   * 説明ウィンドウの文章を更新する
   * @param text 更新する文章
   */
  private setDescriptionText(text: string): void {
    this.descriptionTextElement = this.descriptionTextElement ?? DomManager.getElementById(SYNCHRO_BREAK_DESCRIPTION_TEXT_ID)
    if (this.descriptionTextElement === null) return
    this.descriptionTextElement.innerHTML = text
  }
}
