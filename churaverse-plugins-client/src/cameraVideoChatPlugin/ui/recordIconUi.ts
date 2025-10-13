import { IRecordIcon } from '../interface/IRecordIcon'
import { IRecordIconUi } from '../interface/IRecordIconUi'
import { RecordIcon } from './recordIcon'
import { IMainScene, Store } from 'churaverse-engine-client'
import { PlayerRole } from '@churaverse/player-plugin-client/types/playerRole'
import '@churaverse/core-ui-plugin-client/store/defCoreUiPluginStore'

export class RecordIconUI implements IRecordIconUi {
  public readonly recordIcon: IRecordIcon

  public constructor(playerRole: PlayerRole, store: Store<IMainScene>) {
    const coreUiPluginStore = store.of('coreUiPlugin')

    this.recordIcon = new RecordIcon(playerRole, store, coreUiPluginStore.topBarIconContainer)
  }
}
