import { GameIds } from './interface/gameIds'
import { IGameDescriptionDialog } from './interface/IGameDescriptionDialog'
import { IGameDescriptionDialogManager } from './interface/IGameDescriptionDialogManager'

export class GameDescriptionDialogManager implements IGameDescriptionDialogManager {
  private readonly gameDialogs = new Map<GameIds, IGameDescriptionDialog>()
  private showingDialogId: GameIds | null = null

  public add(name: GameIds, dialog: IGameDescriptionDialog): void {
    this.gameDialogs.set(name, dialog)
  }

  public showDialog(gameId: GameIds): void {
    if (this.showingDialogId === gameId) {
      return
    }

    if (this.showingDialogId !== null) {
      this.closeDialog()
    }

    const showingDialogIdDialog = this.gameDialogs.get(gameId)
    if (showingDialogIdDialog === undefined) return
    showingDialogIdDialog.open()
    this.showingDialogId = gameId
  }

  public closeDialog(): void {
    if (this.showingDialogId !== null) {
      const showingDialogIdDialog = this.gameDialogs.get(this.showingDialogId)
      if (showingDialogIdDialog === undefined) return
      showingDialogIdDialog.close()
      this.showingDialogId = null
    }
  }
}
