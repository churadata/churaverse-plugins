import { GameIcon } from './gameIcon'
import { IMainScene, Store } from 'churaverse-engine-client'
import { IGameDialog } from '../interface/IGameDialog'
import { GameDialog } from './gameDialog'
import { GameSection } from './gameSection'
import { IGameSelectionListContainer } from '../interface/IGameSelectionListContainer'

export class GameDialogManager {
  private readonly gameIcon: GameIcon
  private readonly gameDialog: IGameDialog

  public constructor(store: Store<IMainScene>) {
    this.gameDialog = new GameDialog()
    this.gameDialog.addSection(new GameSection('game', 'ゲーム一覧'))
    const coreUiPluginStore = store.of('coreUiPlugin')
    this.gameIcon = new GameIcon(coreUiPluginStore.switcher, this.gameDialog, coreUiPluginStore.topBarIconContainer)
  }

  public init(container: IGameSelectionListContainer): void {
    this.gameDialog.addContent('game', container.node)
  }

  public closeGameDialog(): void {
    this.gameIcon.close()
  }
}
