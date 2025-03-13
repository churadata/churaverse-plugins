import { DomManager, domLayerSetting } from 'churaverse-engine-client'
import { DescriptionWindowComponent } from './component/DescriptionWindowComponent'
import '@churaverse/game-plugin-client/gameUiManager'
import { IDescriptionWindow } from '../../interface/IDescriptionWindow'

export class DescriptionWindow implements IDescriptionWindow {
  public element!: HTMLElement
  public visible: boolean = false
  private descriptionText: string = ''

  public initialize(): void {
    this.element = DomManager.addJsxDom(DescriptionWindowComponent({ description: this.descriptionText }))
    domLayerSetting(this.element, 'lowest')
  }

  public open(text: string): void {
    this.element.style.display = 'flex'
    this.element.innerHTML = text
  }

  public remove(): void {
    this.descriptionText = ''
  }

  /**
   * 説明ウィンドウの文章を更新する
   * @param text 更新する文章
   */
  public setDescriptionText(text: string): void {
    this.element.innerHTML = text
  }

  /**
   * ゲーム開始時主催者サイドの文章更新処理
   * @param gameName ゲーム名
   */
  setGameStartForHost(gameName: string): void {
    this.open(`${gameName}を開始しました。<br>あなたはゲームの管理者です。 <br>ターン数(1~10)を選択してください。`)
  }

  /**
   * ゲーム開始時参加者サイドの文章更新処理
   * @param gameName ゲーム名
   * @param gameOwnerName ゲームオーナーの名前
   */
  setGameStartForGuest(gameName: string, gameOwnerName: string | undefined): void {
    this.setDescriptionText(`${gameName}が開始されました！<br>${gameOwnerName}さんがターンを入力中です。`)
  }

  /**
   * ターン選択後の文章更新処理
   * @param turn 選択されたターン数
   */
  public setTimeLimitSelection(turn: number): void {
    this.setDescriptionText(`${turn}ターン選択しました。<br>制限時間(3~15)を選択してください。`)
  }

  /**
   * ターン選択後の制限時間入力待ち文章更新処理
   * @param turn 選択されたターン数
   * @param gameOwnerName ゲームオーナーの名前
   */
  public setTimeLimitWaiting(turn: number, gameOwnerName: string | undefined): void {
    this.setDescriptionText(`${turn}ターン選択しました。<br>${gameOwnerName}さんが制限時間を入力中です。`)
  }

  /**
   * 主催者サイドの制限時間入力後の文章更新処理
   * @param timeLimit 選択された制限時間
   */
  public setTimeLimitConfirmed(timeLimit: string): void {
    this.setDescriptionText(`制限時間を${timeLimit}秒選択しました。<br>ベットコインを入力してください。`)
  }

  /**
   * 参加者サイドの制限時間入力後の文章更新処理
   * @param timeLimit 選択された制限時間
   */
  public setTimeLimitAcknowledged(timeLimit: string): void {
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
    this.setDescriptionText(`シンクロブレイク開始！！！<br>残り${timeLimit}秒以内にボタンを押してください！`)
  }

  /**
   * シンクロブレイク進行中の文章更新処理
   * @param countdown シンクロブレイク終了までのカウントダウン
   */
  public setSynchroBreakInProgress(
    countdown: number,
    playerName: string | undefined,
    nyokkiSuccessMessage: string | undefined
  ): void {
    const descriptionText = ['現在シンクロブレイク進行中', `残り${countdown}秒以内にボタンを押してください！`]
    if (!!playerName && !!nyokkiSuccessMessage) {
      descriptionText.splice(1, 0, nyokkiSuccessMessage)
    }

    this.setDescriptionText(descriptionText.join('<br>') as string)
  }

  /**
   * シンクロブレイク終了の文章更新処理
   */
  public setSynchroBreakEnd(): void {
    this.setDescriptionText('シンクロブレイク終了！！！')
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

  public setNyokkiSuccess(text: string): void {
    const descriptionText = this.element.innerHTML.split('<br>')
    descriptionText.splice(1, 0, text)
    this.setDescriptionText(descriptionText.join('<br>'))
  }
}
