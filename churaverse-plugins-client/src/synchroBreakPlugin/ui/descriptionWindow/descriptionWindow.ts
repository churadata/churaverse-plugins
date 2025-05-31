import { DomManager, domLayerSetting } from 'churaverse-engine-client'
import { DescriptionWindowComponent } from './component/DescriptionWindowComponent'
import '@churaverse/game-plugin-client/gameUiManager'
import { IDescriptionText } from '../../interface/IDescriptionText'

export class DescriptionWindow implements IDescriptionText {
  public element!: HTMLElement
  public visible: boolean = false
  private descriptionText: string = ''
  private gameName: string = 'ゲーム'
  private gameOwnerName: string = 'ゲームオーナー'

  public setGameBaseInfo(gameName: string, ownerName: string): void {
    this.gameName = gameName
    this.gameOwnerName = ownerName
  }

  public initialize(): void {
    this.element = DomManager.addJsxDom(DescriptionWindowComponent({ description: this.descriptionText }))
    domLayerSetting(this.element, 'lowest')
  }

  public open(): void {
    this.element.style.display = 'flex'
  }

  public remove(): void {
    this.descriptionText = ''
  }

  /**
   * 説明ウィンドウの文章を更新する
   * @param text 更新する文章
   */
  private setDescriptionText(text: string): void {
    this.element.innerHTML = text
  }

  /**
   * ゲーム開始時主催者サイドの文章更新処理
   */
  public setGameStartForHost(): void {
    this.open()
    this.setDescriptionText(
      `${this.gameName}を開始しました。<br>あなたはゲームの管理者です。 <br>ターン数(1~10)を選択してください。`
    )
  }

  /**
   * ゲーム開始時参加者サイドの文章更新処理
   */
  public setGameStartForGuest(): void {
    this.open()
    this.setDescriptionText(`${this.gameName}が開始されました！<br>${this.gameOwnerName}さんがターンを入力中です。`)
  }

  /**
   * ターン選択後の文章更新処理
   * @param turn 選択されたターン数
   */
  public setTurnSelectionForOwner(turn: number): void {
    this.setDescriptionText(`${turn}ターン選択しました。<br>制限時間(3~15)を選択してください。`)
  }

  /**
   * ターン選択後の制限時間入力待ち文章更新処理
   * @param turn 選択されたターン数
   */
  public setTurnSelectionForGuest(turn: number): void {
    this.setDescriptionText(`${turn}ターン選択しました。<br>${this.gameOwnerName}さんが制限時間を入力中です。`)
  }

  /**
   * 主催者サイドの制限時間入力後の文章更新処理
   * @param timeLimit 選択された制限時間
   */
  public setTimeLimitSelectionForOwner(timeLimit: string): void {
    this.setDescriptionText(`制限時間を${timeLimit}秒選択しました。<br>ベットコインを入力してください。`)
  }

  /**
   * 参加者サイドの制限時間入力後の文章更新処理
   * @param timeLimit 選択された制限時間
   */
  public setTimeLimitSelectionForGuest(timeLimit: string): void {
    this.setDescriptionText(`制限時間が${timeLimit}秒選択されました。<br>ベットコインを入力してください。`)
  }

  /**
   * ベットコイン選択後の文章更新処理
   * @param betCoins 選択されたベットコイン数
   */
  public setBetCoinSelection(betCoins: number): void {
    this.setDescriptionText(`ベットコインを${betCoins}枚選択しました。<br>相手のベットコインを待っています。`)
  }

  /**
   * ゲーム開始カウントダウンの文章更新処理
   * @param countdown ゲーム開始までのカウントダウン
   */
  public setGameStartCountdown(countdown: number): void {
    this.setDescriptionText(`ゲーム開始まで<br>${countdown}秒`)
  }

  /**
   * シンクロブレイク開始の文章更新処理
   * @param timeLimit シンクロブレイクの制限時間
   */
  public setSynchroBreakStart(timeLimit: number): void {
    this.setDescriptionText(`${this.gameName}開始！！！<br>残り${timeLimit}秒以内にボタンを押してください！`)
  }

  /**
   * シンクロブレイク進行中の文章更新処理
   * @param countdown シンクロブレイク終了までのカウントダウン
   */
  public setSynchroBreakInProgress(countdown: number, playerName?: string, nyokkiActionMessage?: string): void {
    const descriptionText = [`現在${this.gameName}進行中`, `残り${countdown}秒以内にボタンを押してください！`]
    if (playerName !== undefined && nyokkiActionMessage !== undefined) {
      descriptionText.splice(1, 0, nyokkiActionMessage)
    }

    this.setDescriptionText(descriptionText.join('<br>'))
  }

  /**
   * シンクロブレイク終了の文章更新処理
   */
  public setSynchroBreakEnd(): void {
    this.setDescriptionText(`${this.gameName}終了！！！`)
  }

  /**
   * ターン終了の文章更新処理
   * @param turnNumber 残りターン数
   */
  public setTurnStart(turnNumber: number): void {
    this.setDescriptionText(
      `ターンが終了しました。<br>残り${turnNumber}ターンです。<br>ベットコインを入力してください。`
    )
  }

  /**
   * ニョッキアクションの文章更新処理
   * @param text ニョッキアクションの文章
   */
  public setNyokkiAction(text: string): void {
    const descriptionText = this.element.innerHTML.split('<br>')
    descriptionText.splice(1, 0, text)
    this.setDescriptionText(descriptionText.join('<br>'))
  }
}
