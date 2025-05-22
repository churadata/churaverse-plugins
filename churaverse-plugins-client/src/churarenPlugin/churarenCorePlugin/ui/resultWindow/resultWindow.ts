import { domLayerSetting, DomManager } from 'churaverse-engine-client'
import { GameResultWindowComponent } from './component/ResultWindowComponent'
import { IResultWindow } from '../../interface/IChurarenUiComponent'
import { ChurarenGameResultType } from '../../types/uiTypes'

export const CHURAREN_GAME_FINISH_BUTTON_ID = 'churaren-game-finish-button'
export const CHURAREN_GAME_RESULT_TEXT_ID = 'churaren-game-result-text'

export class ResultWindow implements IResultWindow {
  public element!: HTMLElement
  public visible: boolean = false

  public initialize(): void {
    this.element = DomManager.addJsxDom(GameResultWindowComponent())
    domLayerSetting(this.element, 'lowest')
    this.setFinishButton()
  }

  // 結果画面の表示
  private setFinishButton(): void {
    const finishButton = DomManager.getElementById(CHURAREN_GAME_FINISH_BUTTON_ID)

    finishButton.onclick = () => {
      this.remove()
    }
  }

  public showResult(result: ChurarenGameResultType): void {
    const resultText = DomManager.getElementById(CHURAREN_GAME_RESULT_TEXT_ID)
    switch (result) {
      case 'win':
        resultText.innerHTML = '勝利！！！！！'
        break
      case 'timeOver':
        resultText.innerHTML = '残念！タイムオーバー'
        break
      case 'gameOver':
        resultText.innerHTML = '全滅！！ゲームオーバー！'
        break
    }
    this.element.style.display = 'flex'
  }

  public remove(): void {
    this.element.style.display = 'none'
    this.element.parentNode?.removeChild(this.element)
  }
}
