import { Store, IMainScene, IEventBus } from 'churaverse-engine-client'
import { AdminSettingSection } from '@churaverse/core-ui-plugin-client/adminSettingDialog/adminSettingSection'
import { MapManager } from '../mapManager'
import { MapSelector } from './mapSelector/mapSelector'
import '@churaverse/core-ui-plugin-client/store/defCoreUiPluginStore'

export function setupMapUi(
  store: Store<IMainScene>,
  eventBus: IEventBus<IMainScene>,
  mapManager: MapManager
): MapSelector {
  const uiStore = store.of('coreUiPlugin')
  uiStore.adminSettingDialog.addSection(new AdminSettingSection('mapSetting', 'マップ設定'))

  const mapIdAndDisplayName: Array<[string, string]> = mapManager.mapIds.map((id) => {
    return [id, mapManager.getMapConfigInfo(id).displayName]
  })

  return new MapSelector(eventBus, mapIdAndDisplayName, uiStore.adminSettingDialog)
}
