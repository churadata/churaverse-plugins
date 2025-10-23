import { GameIds } from './interface/gameIds'
import { GameDescriptionDialogState, IGameDescriptionDialog } from './interface/IGameDescriptionDialog'
import { IGameDescriptionDialogManager } from './interface/IGameDescriptionDialogManager'

export class GameDescriptionDialogManager implements IGameDescriptionDialogManager {
  private readonly gameDialogs = new Map<GameIds, IGameDescriptionDialog>()
  private showingDialogId: GameIds | null = null

  public add(name: GameIds, dialog: IGameDescriptionDialog): void {
    this.gameDialogs.set(name, dialog)
  }

  public showDialog(gameId: GameIds, status: GameDescriptionDialogState): void {
    if (this.showingDialogId === gameId && status === 'showCloseButton') {
      return
    }

    if (this.showingDialogId !== null) {
      this.closeDialog()
    }

    const targetDialog = this.gameDialogs.get(gameId)
    if (targetDialog === undefined) return
    targetDialog.open(status)
    this.showingDialogId = gameId
  }

  public closeDialog(): void {
    if (this.showingDialogId !== null) {
      const targetDialog = this.gameDialogs.get(this.showingDialogId)
      if (targetDialog === undefined) return
      targetDialog.close()
      this.showingDialogId = null
    }
  }
}
