import { DomManager } from 'churaverse-engine-client'
import { GameSelectionList } from './components/GameListComponent'
import { GameListItemRenderer } from './gameListItemRenderer'
import { IGameSelectionListContainer } from '../../interface/IGameSelectionListContainer'

export const GAME_SELECTION_LIST_ID = 'game-selection-list'

export class GameSelectionListContainer implements IGameSelectionListContainer {
  private readonly containerDiv: HTMLElement

  public constructor() {
    this.containerDiv = DomManager.addJsxDom(GameSelectionList())
  }

  /**
   * アイコンを追加する
   * @param game
   */
  public addGame(game: GameListItemRenderer): void {
    this.containerDiv.appendChild(game.node)
  }

  public get node(): HTMLElement {
    return this.containerDiv
  }
}
