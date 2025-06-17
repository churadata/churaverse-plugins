import { BaseGamePlugin } from '@churaverse/game-plugin-server/domain/baseGamePlugin'
import { ItemPluginStore } from './store/defItemPluginStore'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { IMainScene } from 'churaverse-engine-server'
import { SocketController } from './controller/socketController'
import { RegisterOnOverlapEvent } from '@churaverse/collision-detection-plugin-server/event/registerOnOverlap'
import { initItemPluginStore } from './store/initItemPluginStore'
import { Item } from './domain/item'
import { Player } from '@churaverse/player-plugin-server/domain/player'
import { CHURAREN_CONSTANTS } from '@churaverse/churaren-core-plugin-server'
import { removeItems, sendGeneratedItems } from './domain/itemService'
import { IGameInfo } from '@churaverse/game-plugin-server/interface/IGameInfo'
import '@churaverse/churaren-core-plugin-server/event/churarenStartTimerEvent'
import '@churaverse/churaren-core-plugin-server/event/churarenResultEvent'
import { ChurarenItemDespawnMessage } from './message/churarenItemDespawnMessage'
import { ChurarenItemSpawnMessage } from './message/churarenItemSpawnMessage'

const ITEM_GENERATE_INTERVAL_MS = 10000

export class ChurarenItemPlugin extends BaseGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  private itemPluginStore!: ItemPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private churarenGameInfo?: IGameInfo
  private socketController!: SocketController

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('init', this.init.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )

    this.bus.subscribeEvent('registerOnOverlap', this.registerOnOverlap.bind(this))
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('update', this.update)
    this.bus.subscribeEvent('churarenStartTimer', this.generateItems)
    this.bus.subscribeEvent('churarenResult', this.removeAllItems)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('update', this.update)
    this.bus.unsubscribeEvent('churarenStartTimer', this.generateItems)
    this.bus.unsubscribeEvent('churarenResult', this.removeAllItems)
  }

  private init(): void {
    initItemPluginStore(this.store)
    this.itemPluginStore = this.store.of('churarenItemPlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  private readonly update = (): void => {
    removeItems(this.itemPluginStore.items, (itemIds: string[]) => {
      const itemDespawnMessage = new ChurarenItemDespawnMessage({ itemIds })
      this.networkPluginStore.messageSender.send(itemDespawnMessage)
    })
  }

  protected handleGameStart(): void {
    this.churarenGameInfo = this.store.of('gamePlugin').games.get(this.gameId)
  }

  protected handleGameTermination(): void {
    this.itemPluginStore.items.clear()
  }

  private readonly generateItems = (): void => {
    const generateItemsLoop = (): void => {
      if (this.churarenGameInfo === undefined || !this.isActive) return
      sendGeneratedItems(
        this.itemPluginStore.items,
        this.churarenGameInfo.participantIds.length,
        this.store.of('mapPlugin').mapManager.currentMap,
        (items) => {
          const itemSpawnMessage = new ChurarenItemSpawnMessage({ items })
          this.networkPluginStore.messageSender.send(itemSpawnMessage)
        }
      )
      setTimeout(generateItemsLoop, ITEM_GENERATE_INTERVAL_MS)
    }
    generateItemsLoop()
  }

  private registerOnOverlap(ev: RegisterOnOverlapEvent): void {
    ev.collisionDetector.register(
      this.itemPluginStore.items,
      this.store.of('playerPlugin').players,
      this.getItem.bind(this)
    )
  }

  private getItem(item: Item, player: Player): void {
    // TODO: ChurarenPlayerPluginのGetItemEventをpostする
  }

  private readonly removeAllItems = (): void => {
    const itemIds = this.itemPluginStore.items.getAllId()
    this.networkPluginStore.messageSender.send(new ChurarenItemDespawnMessage({ itemIds }))
    this.itemPluginStore.items.clear()
  }
}
