import { IMainScene, IEventBus, Store } from 'churaverse-engine-server'
import { RegisterMessageEvent } from '@churaverse/network-plugin-server/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-server/event/registerMessageListenerEvent'
import { BaseSocketController } from '@churaverse/network-plugin-server/interface/baseSocketController'
import { PriorDataRequestMessage } from '@churaverse/network-plugin-server/message/priorDataMessage'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { ChangeMapEvent } from '../event/changeMapEvent'
import { RequestChangeMapDataMessage, ResponseChangeMapDataMessage } from '../message/changeMapMessage'
import { PriorMapData, PriorMapDataMessage } from '../message/priorMapDataMessage'
import { MapPluginStore } from '../store/defMapPluginStore'

export class SocketController extends BaseSocketController<IMainScene> {
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private mapPluginStore!: MapPluginStore

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
    eventBus.subscribeEvent('init', this.getStores.bind(this))
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('priorMapData', PriorMapDataMessage, 'onlySelf')
    ev.messageRegister.registerMessage('requestChangeMapData', RequestChangeMapDataMessage, 'onlyServer')
    ev.messageRegister.registerMessage('responseChangeMapDataMessage', ResponseChangeMapDataMessage, 'allClients')
  }

  private getStores(): void {
    this.networkPluginStore = this.store.of('networkPlugin')
    this.mapPluginStore = this.store.of('mapPlugin')
  }

  public registerMessageListener(ev: RegisterMessageListenerEvent<IMainScene>): void {
    ev.messageListenerRegister.on('requestPriorData', this.sendPriorMapData.bind(this))
    ev.messageListenerRegister.on('requestChangeMapData', this.changeMap.bind(this))
  }

  public sendPriorMapData(msg: PriorDataRequestMessage, senderId: string): void {
    const data: PriorMapData = {
      mapId: this.mapPluginStore.mapManager.currentMap.mapId,
    }
    this.networkPluginStore.messageSender.send(new PriorMapDataMessage(data), senderId)
  }

  public changeMap(msg: RequestChangeMapDataMessage, senderId: string): void {
    this.eventBus.post(new ChangeMapEvent(msg.data.mapId, senderId))
  }
}
