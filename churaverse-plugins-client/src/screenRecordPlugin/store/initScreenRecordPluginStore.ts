import { IMainScene, Store } from 'churaverse-engine-client'
import { ScreenRecordPluginStore } from './defScreenRecordPluginStore'

export function initScreenRecordPluginStore(store: Store<IMainScene>): void {
  const pluginStore: ScreenRecordPluginStore = {
    isRecording: false,
  }
  store.setInit('screenRecordPlugin', pluginStore)
}
