import { GameIds } from './interface/gameIds'
import { IGameUiComponent } from './interface/IGameUiComponent'
import { GameUiName, GameUiMap } from './gameUiManager'
import { GameUiComponentNotFoundError } from './errors/gameUiComponentNotFoundError'

export class GameUiRegister {
  private readonly gameUiRegister = new Map<GameIds, Map<GameUiName, IGameUiComponent>>()

  /**
   * gameUiComponentを登録する
   * @param gameId ゲームID
   * @param uiName UI名
   * @param gameUiComponent 登録するUIコンポーネント
   */
  public registerGameUi(gameId: GameIds, uiName: GameUiName, gameUiComponent: IGameUiComponent): void {
    if (!this.gameUiRegister.has(gameId)) {
      this.gameUiRegister.set(gameId, new Map<GameUiName, IGameUiComponent>())
    }
    const uiMap = this.gameUiRegister.get(gameId)
    if (uiMap === undefined) throw new GameUiComponentNotFoundError(gameId)
    uiMap.set(uiName, gameUiComponent)
  }

  /**
   * 登録されたgameUiComponentを取得する
   * @param gameId ゲームID
   * @param uiName UI名
   */
  public getUiComponent<K extends GameUiName>(gameId: GameIds, uiName: K): GameUiMap[GameIds][K] | undefined {
    return this.gameUiRegister.get(gameId)?.get(uiName) as GameUiMap[GameIds][K]
  }

  /**
   * GameIdに紐づく全コンポーネントを取得
   */
  public getAllUiComponents(gameId: GameIds): IGameUiComponent[] {
    const uiMap = this.gameUiRegister.get(gameId)
    if (uiMap === undefined) throw new GameUiComponentNotFoundError(gameId)
    return Array.from(uiMap.values())
  }
}
