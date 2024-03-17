import { ITopBarIconRenderer } from '../../coreUiPlugin/interface/IDialogIconRenderer'
import { IVideoChatUi } from '../interface/IVideoChatUI'
import { VideoChatIcon } from './videoChatIcon'
import { IEventBus, IMainScene, Store } from 'churaverse-engine-client'

export class VideoChatUI implements IVideoChatUi {
  public readonly videoChatIcon: ITopBarIconRenderer

  public constructor(store: Store<IMainScene>, eventBus: IEventBus<IMainScene>) {
    const coreUiPluginStore = store.of('coreUiPlugin')

    this.videoChatIcon = new VideoChatIcon(coreUiPluginStore.topBarIconContainer, eventBus)
  }
}
