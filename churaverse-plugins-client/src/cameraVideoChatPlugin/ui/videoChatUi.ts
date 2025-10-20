import { IVideoChatIcon } from '../interface/IVideoChatIcon'
import { IVideoChatUi } from '../interface/IVideoChatUI'
import { VideoChatIcon } from './videoChatIcon'
import { IEventBus, IMainScene, Store } from 'churaverse-engine-client'
import '@churaverse/core-ui-plugin-client/store/defCoreUiPluginStore'

export class VideoChatUI implements IVideoChatUi {
  public readonly videoChatIcon: IVideoChatIcon

  public constructor(store: Store<IMainScene>, eventBus: IEventBus<IMainScene>) {
    const coreUiPluginStore = store.of('coreUiPlugin')

    this.videoChatIcon = new VideoChatIcon(coreUiPluginStore.topBarIconContainer, eventBus)
  }
}
