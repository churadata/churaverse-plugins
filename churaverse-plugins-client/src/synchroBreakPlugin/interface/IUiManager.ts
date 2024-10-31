import { IGameUi } from './IGameUi'

export interface IUiManager {
  addUi: (uiName: string, ui: IGameUi) => void
  openUi: (uiName: string) => void
  closeUi: (uiName: string) => void
  removeUi: (uiName: string) => void
  openAllUis: () => void
  closeAllUis: () => void
  removeAllUis: () => void
}
