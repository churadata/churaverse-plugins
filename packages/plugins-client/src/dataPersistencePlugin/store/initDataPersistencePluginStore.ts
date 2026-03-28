import { Store,Scenes } from 'churaverse-engine-client'
import { DataPersistencePluginStore } from './defDataPersistencePluginStore'
import { IDataPersistence } from '../interface/IDataPersistence'

export function initDataPersistencePluginStore(store: Store<Scenes>, dataPersistence: IDataPersistence): void {
  const dataPersistencePluginStore: DataPersistencePluginStore = {
    dataPersistence,
  }

  store.setInit('dataPersistencePlugin', dataPersistencePluginStore)
}
