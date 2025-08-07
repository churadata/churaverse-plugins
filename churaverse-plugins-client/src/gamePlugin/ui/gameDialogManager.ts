import { CoreUiPluginStore } from '@churaverse/core-ui-plugin-client/store/defCoreUiPluginStore'
import { GameIcon } from './gameIcon'
import { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import { IGameDialog } from '../interface/IGameDialog'
import { GameDialog } from './gameDialog'
import { GameSection } from './gameSection'

export class GameDialogManager {
  private readonly gameIcon: GameIcon
  private readonly coreUiPluginStore: CoreUiPluginStore
  private readonly gameDialog: IGameDialog

  public constructor(
    protected store: Store<IMainScene>,
    bus: IEventBus<IMainScene>
  ) {
    this.gameDialog = new GameDialog()
    this.gameDialog.addSection(new GameSection('game', 'ゲーム一覧'))
    this.coreUiPluginStore = store.of('coreUiPlugin')
    this.gameIcon = new GameIcon(
      this.coreUiPluginStore.switcher,
      this.gameDialog,
      this.coreUiPluginStore.topBarIconContainer
    )
  }

  public init(): void {
    const node = this.store.of('gamePlugin').gameSelectionListContainer.node
    this.gameDialog.addContent('game', node)
  }

  public closeGameDialog(): void {
    this.gameIcon.close()
  }
}
