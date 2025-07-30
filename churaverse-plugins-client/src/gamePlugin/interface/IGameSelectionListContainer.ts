import { GameListItemRenderer } from '../ui/gameList/gameListItemRenderer'

export interface IGameSelectionListContainer {
  node: HTMLElement
  addGame: (game: GameListItemRenderer) => void
}
