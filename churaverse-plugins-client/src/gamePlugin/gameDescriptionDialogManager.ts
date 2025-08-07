import { GameIds } from './interface/gameIds'
import { IGameDescriptionDialog } from './interface/IGameDescriptionDialog'
import { IGameDescriptionDialogManager } from './interface/IGameDescriptionDialogManager'

export class GameDescriptionDialogManager implements IGameDescriptionDialogManager {
  private readonly gameDialogs = new Map<GameIds, IGameDescriptionDialog>()
  private target: GameIds | null = null

  public add(name: GameIds, dialog: IGameDescriptionDialog): void {
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
