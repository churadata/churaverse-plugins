import { GameIds } from '../interface/gameIds'
import { IGameDialogManager } from '../interface/IGameDialogManager'

export class GameDialogRepository {
  private readonly gameDialogs = new Map<GameIds, IGameDialogManager>()

  public set(gameId: GameIds, gameDialog: IGameDialogManager): void {
    this.gameDialogs.set(gameId, gameDialog)
  }

  public delete(gameId: GameIds): void {
    this.gameDialogs.delete(gameId)
  }

  public get(gameId: GameIds): IGameDialogManager | undefined {
    return this.gameDialogs.get(gameId)
  }
}
