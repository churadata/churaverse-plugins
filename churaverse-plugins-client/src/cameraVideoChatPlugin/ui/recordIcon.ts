import { PlayerRole } from '@churaverse/player-plugin-client/types/playerRole'
import { TopBarIconRenderer } from '@churaverse/core-ui-plugin-client/topBarIcon'
import { ITopBarIconContainer } from '@churaverse/core-ui-plugin-client/interface/ITopBarIconContainer'
import { IMainScene, Store } from 'churaverse-engine-client'
import { ScreenRecordStatusChangedMessage } from '../message/screenRecordStatusChangedMessage'

import RECORD_ON_ICON_PATH from './assets/record_on.png'
import RECORD_OFF_ICON_PATH from './assets/record_off.png'
import { IRecordIcon } from '../interface/IRecordIcon'

export class RecordIcon extends TopBarIconRenderer implements IRecordIcon {
  private readonly iconDivContainer: HTMLDivElement
  private readonly store: Store<IMainScene>

  public constructor(playerRole: PlayerRole, store: Store<IMainScene>, iconContainer: ITopBarIconContainer) {
    super({
      activeIconImgPath: RECORD_ON_ICON_PATH,
      inactiveIconImgPath: RECORD_OFF_ICON_PATH,
      onClick: (isActive: boolean) => {
        this.onClick(isActive)
      },
      isActive: false,
      order: 50,
    })
    this.store = store

    this.iconDivContainer = document.createElement('div')
    this.iconDivContainer.style.position = 'relative'
    this.iconDivContainer.appendChild(super.node)

    if (playerRole !== 'admin') return
    iconContainer.addIcon(this)
    super.deactivate()
  }

  public setActive(isActive: boolean): void {
    if (isActive) {
      super.activate()
    } else {
      super.deactivate()
    }
  }

  private onClick(isActive: boolean): void {
    if (!confirm(`画面録画を${isActive ? '停止' : '開始'}しますか？`)) return

    this.store.of('networkPlugin').messageSender.send(new ScreenRecordStatusChangedMessage({ isRecording: !isActive }))
  }
}
