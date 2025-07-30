import { GameIds } from './interface/gameIds'
import { IGameDescriptionDialogManager } from './interface/IGameDescriptionDialogManager'
import { IGameDescriptionWindow } from './interface/IGameDescriptionWindow'

export class GameDescriptionDialogManager implements IGameDescriptionDialogManager {
  private readonly gameDialogs = new Map<GameIds, IGameDescriptionWindow>()
  private target: GameIds | null = null

  public add(name: GameIds, dialog: IGameDescriptionWindow): void {
    this.gameDialogs.set(name, dialog)
  }

  public showDescription(gameId: GameIds): void {
    if (this.target === gameId) {
      return
    }

    if (this.target !== null) {
      this.closeDescription()
    }

    const targetDialog = this.gameDialogs.get(gameId)
    if (targetDialog === undefined) return
    targetDialog.open()
    this.target = gameId
  }

  public closeDescription(): void {
    if (this.target !== null) {
      const targetDialog = this.gameDialogs.get(this.target)
      if (targetDialog === undefined) return
      targetDialog.close()
      this.target = null
    }
  }
}
