import { TopBarIconRenderer } from '../coreUiPlugin/topBarIcon'
import { Store, IMainScene } from 'churaverse-engine-client'
import { PlayerList } from './playerListDialog/playerList'
import { PlayerListDialog } from './playerListDialog/playerListDialog'
import { PlayerListIcon } from './playerListDialog/playerListIcon'
import { IPlayerListUi } from './interface/IPlayerListUi'

export class PlayerListUi implements IPlayerListUi {
  public playerListDialog: PlayerListDialog
  public playerListIcon: TopBarIconRenderer
  public playerList: PlayerList
  public constructor(store: Store<IMainScene>) {
    this.playerListDialog = new PlayerListDialog()
    const coreUiPluginStore = store.of('coreUiPlugin')
    this.playerListIcon = new PlayerListIcon(
      coreUiPluginStore.switcher,
      this.playerListDialog,
      coreUiPluginStore.topBarIconContainer
    )

    this.playerList = new PlayerList(this.playerListDialog)
  }
}
