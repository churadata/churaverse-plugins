import { IMainScene, Store } from 'churaverse-engine-server'
import { ScreenRecordPluginStore } from './defScreenRecordPluginStore'

export function initScreenRecordPluginStore(store: Store<IMainScene>): void {
  const screenRecordPluginStore: ScreenRecordPluginStore = {
    isRecording: false,
    egressId: undefined,
    startedAt: undefined
  }

  store.setInit('screenRecordPlugin', screenRecordPluginStore)
}
