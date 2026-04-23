import { TopBarIconRenderer } from '@churaverse/core-ui-plugin-client/topBarIcon'
import { ITopBarIconContainer } from '@churaverse/core-ui-plugin-client/interface/ITopBarIconContainer'
import { IMainScene, Store } from 'churaverse-engine-client'
import { NetworkPluginStore } from '@churaverse/network-plugin-client/store/defNetworkPluginStore'
import { StartScreenRecordMessage } from '../message/startScreenRecordMessage'
import { StopScreenRecordMessage } from '../message/stopScreenRecordMessage'

import RECORD_ON_ICON_PATH from '../assets/record_on.png'
import RECORD_OFF_ICON_PATH from '../assets/record_off.png'

export class ScreenRecordIcon extends TopBarIconRenderer {
  private readonly networkPluginStore: NetworkPluginStore<IMainScene>

  public constructor(
    iconContainer: ITopBarIconContainer,
    store: Store<IMainScene>,
    private readonly playerId: string
  ) {
    super({
      activeIconImgPath: RECORD_ON_ICON_PATH,
      inactiveIconImgPath: RECORD_OFF_ICON_PATH,
      onClick: (isActive: boolean) => {
        this.onClick(isActive)
      },
      isActive: false,
      order: 100,
      width: '30px',
      height: '30px',
    })

    this.networkPluginStore = store.of('networkPlugin')
    iconContainer.addIcon(this)

    this.imgElement.style.marginTop = '5px'
  }

  private onClick(isActive: boolean): void {
    if (isActive) {
      super.deactivate()
      this.networkPluginStore.messageSender.send(new StopScreenRecordMessage({ playerId: this.playerId }))
    } else {
      super.activate()
      this.imgElement.style.opacity = '0.9'
      this.networkPluginStore.messageSender.send(new StartScreenRecordMessage({ playerId: this.playerId }))
    }
  }
}
