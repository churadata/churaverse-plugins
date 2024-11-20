import { GameIds } from './interface/gameIds'
import { IGameUiComponent } from './interface/IGameUiComponent'

export class GameUiRegister {
  private readonly gameUiRegister = new Map<GameIds, IGameUiComponent[]>()

  /**
   * gameUiComponentを登録する
   */
  public registerGameUi(gameId: GameIds, gameUiComponent: IGameUiComponent): void {
    // すでにgameIdが登録されている場合、配列に追加する
    if (this.gameUiRegister.has(gameId)) {
      const existingComponents = this.gameUiRegister.get(gameId)
      existingComponents?.push(gameUiComponent)
    } else {
      // まだgameIdが登録されていない場合、新しく配列を作成する
      this.gameUiRegister.set(gameId, [gameUiComponent])
    }
  }

  /**
   * 登録されたgameUiComponentを取得する
   */
  public getRegistered(gameId: GameIds): IGameUiComponent[] {
    const gameUiComponents = this.gameUiRegister.get(gameId)
    if (gameUiComponents === undefined) throw new Error('Not exists gameUiComponent')
    return gameUiComponents
  }
}
