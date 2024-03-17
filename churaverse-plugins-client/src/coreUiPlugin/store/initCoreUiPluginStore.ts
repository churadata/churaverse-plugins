import { TopBarIconContainer } from '../topBarIconContainer'
import { CoreUiPluginStore } from './defCoreUiPluginStore'
import { SettingDialog } from '../settingDialog/settingDialog'
import { DialogSwitcher } from '../dialog/dialogSwitcher'
import { AdminSettingDialog } from '../adminSettingDialog/adminSettingDialog'
import { FadeOutLogRenderer } from '../fadeOutLog/fadeOutLogRenderer'
import { IFocusTargetRepository } from '../interface/IFocusTargetRepository'
import { IEventBus, Scenes, Store, IMainScene } from 'churaverse-engine-client'

export function initCoreUiPlugin(
  eventBus: IEventBus<Scenes>,
  store: Store<IMainScene>,
  scene: Phaser.Scene,
  focusTargetRepository: IFocusTargetRepository
): void {
  const pluginStore: CoreUiPluginStore = {
    topBarIconContainer: new TopBarIconContainer(),
    settingDialog: new SettingDialog(),
    adminSettingDialog: new AdminSettingDialog(),
    switcher: new DialogSwitcher(eventBus),
    fadeOutLogRenderer: new FadeOutLogRenderer(scene, 300),
    focusTargetRepository,
  }

  store.setInit('coreUiPlugin', pluginStore)
}
