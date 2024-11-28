import { GameIds } from './interface/gameIds'
import { IGameUiComponent } from './interface/IGameUiComponent'
import { GameUiRegister } from './gameUiRegister'
import { IGameUiManager } from './interface/IGameUiManager'

export class GameUiManager implements IGameUiManager {
  private readonly gameUiRegister: GameUiRegister

  public constructor(gameUiRegister: GameUiRegister) {
    this.gameUiRegister = gameUiRegister
  }

  /**
   * 特定のGameIdのUIを初期化する
   */
  public initializeAllUis(gameId: GameIds): void {
    const components = this.getAllUiComponents(gameId)
    components.forEach((component) => {
      component.initialize()
      if (!component.visible) {
        component.element.style.display = 'none'
      }
    })
  }

  /**
   * 指定されたゲームidとUI名に対応するUIを取得する
   * @param gameId ゲームid
   * @param uiName UI名
   */
  public getUi<K extends GameUiName>(gameId: GameIds, uiName: K): GameUiMap[GameIds][K] | undefined {
    return this.gameUiRegister.getUiComponent(gameId, uiName)
  }

  /**
   * 特定のGameIdのUIを全て削除する
   */
  public removeAllUis(gameId: GameIds): void {
    const components = this.getAllUiComponents(gameId)
    components.forEach((component) => {
      component.remove()
      component.element.remove() // HTMLElementを削除
    })
  }

  /**
   * GameIdに紐づく全コンポーネントを取得
   */
  private getAllUiComponents(gameId: GameIds): IGameUiComponent[] {
    return this.gameUiRegister.getAllUiComponents(gameId)
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GameUiMap {}
export type CompleteGameUiMap = GameUiMap & {
  [gameId in GameIds]: Record<string, IGameUiComponent>
}
export type GameUiName = keyof GameUiMap[GameIds]
