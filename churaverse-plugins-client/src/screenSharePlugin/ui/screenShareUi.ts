import { Store, IMainScene } from 'churaverse-engine-client'
import { IScreenShareSender } from '../interface/IScreenShareSender'
import { ScreenShareIcon } from './screenShareIcon/screenShareIcon'

export class ScreenShareUi {
  public readonly screenShareIcon: ScreenShareIcon

  public constructor(store: Store<IMainScene>, screenShareSender: IScreenShareSender) {
    const uiStore = store.of('coreUiPlugin')
    this.screenShareIcon = new ScreenShareIcon(uiStore.topBarIconContainer, screenShareSender)
  }
}
