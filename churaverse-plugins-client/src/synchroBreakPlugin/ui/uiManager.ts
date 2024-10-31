import { IUiManager } from '../interface/IUiManager'
import { IGameUi } from '../interface/IGameUi'

export class UiManager implements IUiManager {
  private readonly gameUis = new Map<GameUiName, IGameUi>()

  public addUi(uiName: string, ui: IGameUi): void {
    this.gameUis.set(uiName, ui)
  }

  public getUi<K extends GameUiName = keyof GameUiMap>(uiName: K): CompleteGameUiMap[K] | undefined {
    return this.gameUis.get(uiName)
  }

  public openUi(uiName: string): void {
    const ui = this.gameUis.get(uiName)
    ui?.open()
  }

  public closeUi(uiName: string): void {
    const ui = this.gameUis.get(uiName)
    ui?.close()
  }

  public removeUi(uiName: string): void {
    const ui = this.gameUis.get(uiName)
    ui?.remove()
    this.gameUis.delete(uiName)
  }

  public openAllUis(): void {
    this.gameUis.forEach((ui) => {
      ui.open()
    })
  }

  public closeAllUis(): void {
    this.gameUis.forEach((ui) => {
      ui.close()
    })
  }

  public removeAllUis(): void {
    this.gameUis.forEach((ui) => {
      ui.remove()
    })
    this.gameUis.clear()
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GameUiMap {}
export type CompleteGameUiMap = GameUiMap & Record<string, IGameUi>
type GameUiName = keyof CompleteGameUiMap
