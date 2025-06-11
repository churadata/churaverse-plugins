import { BaseSocketController } from '@churaverse/network-plugin-client/interface/baseSocketController'
import { RegisterMessageEvent } from '@churaverse/network-plugin-client/event/registerMessageEvent'
import { RegisterMessageListenerEvent } from '@churaverse/network-plugin-client/event/registerMessageListenerEvent'
import { Item } from '../domain/item'
import { ItemPluginStore } from '../store/defItemPluginStore'
import { IEventBus, IMainScene, Position, Store } from 'churaverse-engine-client'
import { IMessageListenerRegister } from '@churaverse/network-plugin-client/interface/IMessageListenerRegister'
import { ChurarenItemInfo, ChurarenItemSpawnMessage } from '../message/churarenItemSpawnMessage'
import { ChurarenItemDespawnMessage } from '../message/churarenItemDespawnMessage'
import { ChurarenItemSpawnEvent } from '../event/churarenItemSpawnEvent'
import { ChurarenItemDespawnEvent } from '../event/churarenItemDespawnEvent'

export class SocketController extends BaseSocketController<IMainScene> {
  private itemPluginStore!: ItemPluginStore
  public messageListenerRegister!: IMessageListenerRegister<IMainScene>

  public constructor(eventBus: IEventBus<IMainScene>, store: Store<IMainScene>) {
    super(eventBus, store)
  }

  public registerMessage(ev: RegisterMessageEvent<IMainScene>): void {
    ev.messageRegister.registerMessage('churarenItemSpawn', ChurarenItemSpawnMessage, 'queue')
    ev.messageRegister.registerMessage('churarenItemDespawn', ChurarenItemDespawnMessage, 'queue')
  }

  public setupMessageListenerRegister(ev: RegisterMessageListenerEvent<IMainScene>): void {
    this.messageListenerRegister = ev.messageListenerRegister
  }

  public getStore(): void {
    this.itemPluginStore = this.store.of('churarenItemPlugin')
  }

  public registerMessageListener(): void {
    this.messageListenerRegister.on('churarenItemSpawn', this.itemSpawn)
    this.messageListenerRegister.on('churarenItemDespawn', this.itemDespawn)
  }

  public unregisterMessageListener(): void {
    this.messageListenerRegister.off('churarenItemSpawn', this.itemSpawn)
    this.messageListenerRegister.off('churarenItemDespawn', this.itemDespawn)
  }

  private readonly itemSpawn = (msg: ChurarenItemSpawnMessage): void => {
    const items: Item[] = []
    for (const [itemId, itemInfo] of Object.entries(msg.data.items)) {
      items.push(this.setItem(itemId, itemInfo))
    }

    // ChurarenItemSpawnEventでまとめてアイテムを送信
    const itemSpawnEvent = new ChurarenItemSpawnEvent(items)
    this.eventBus.post(itemSpawnEvent)
  }

  private setItem(itemId: string, itemInfo: ChurarenItemInfo): Item {
    const pos = new Position(itemInfo.startPos.x, itemInfo.startPos.y)
    const item = new Item(itemId, pos, itemInfo.spawnTime, itemInfo.kind)
    return item
  }

  private readonly itemDespawn = (msg: ChurarenItemDespawnMessage): void => {
    const data = msg.data
    const deleteItemIds: string[] = []
    data.itemIds.forEach((itemId) => {
      if (this.itemPluginStore.items.get(itemId) === undefined) return
      deleteItemIds.push(itemId)
    })
    const itemDespawnEvent = new ChurarenItemDespawnEvent(deleteItemIds)
    this.eventBus.post(itemDespawnEvent)
  }
}
