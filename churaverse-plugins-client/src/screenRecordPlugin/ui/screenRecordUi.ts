import { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import { CoreUiPluginStore } from '@churaverse/core-ui-plugin-client/store/defCoreUiPluginStore'
import '@churaverse/core-ui-plugin-client/store/defCoreUiPluginStore'
import { RecIndicator } from './recIndicator'
import { ScreenRecordIcon } from './screenRecordIcon'

export class ScreenRecordUi {
  public readonly recIndicator: RecIndicator
  public readonly screenRecordIcon?: ScreenRecordIcon

  public constructor(store: Store<IMainScene>, bus: IEventBus<IMainScene>, ownPlayerId: string, isAdmin: boolean) {
    const coreUiPluginStore = store.of('coreUiPlugin') as CoreUiPluginStore

    this.recIndicator = new RecIndicator()

    if (isAdmin) {
      this.screenRecordIcon = new ScreenRecordIcon(coreUiPluginStore.topBarIconContainer, store, ownPlayerId)
    }
  }
}
