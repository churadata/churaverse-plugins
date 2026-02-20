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
import { generatedItemMap, removeItems } from './domain/itemService'
import { IGameInfo } from '@churaverse/game-plugin-server/interface/IGameInfo'
import '@churaverse/churaren-core-plugin-server/event/churarenStartTimerEvent'
import '@churaverse/churaren-core-plugin-server/event/churarenResultEvent'
import { ChurarenItemDespawnMessage } from './message/churarenItemDespawnMessage'
import { ChurarenItemSpawnMessage } from './message/churarenItemSpawnMessage'
import { GetChurarenItemEvent } from '@churaverse/churaren-player-plugin-server/event/getChurarenItemEvent'
import { AlchemyItemRegisterEvent } from './event/alchemyItemRegisterEvent'

const ITEM_GENERATE_INTERVAL_MS = 10000

export class ChurarenItemPlugin extends BaseGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  private itemPluginStore!: ItemPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private churarenGameInfo?: IGameInfo
  private socketController!: SocketController
  private itemGenerateIntervalId?: NodeJS.Timeout

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
    this.bus.subscribeEvent('churarenStartTimer', this.sendGenerateItems)
    this.bus.subscribeEvent('churarenResult', this.removeAllItems)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('update', this.update)
    this.bus.unsubscribeEvent('churarenStartTimer', this.sendGenerateItems)
    this.bus.unsubscribeEvent('churarenResult', this.removeAllItems)
  }

  private init(): void {
    initItemPluginStore(this.store)
    this.itemPluginStore = this.store.of('churarenItemPlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  private readonly update = (): void => {
    const itemIds = removeItems(this.itemPluginStore.items)
    const itemDespawnMessage = new ChurarenItemDespawnMessage({ itemIds })
    this.networkPluginStore.messageSender.send(itemDespawnMessage)
  }

  protected handleGameStart(): void {
    this.churarenGameInfo = this.store.of('gamePlugin').games.get(this.gameId)
    this.bus.post(new AlchemyItemRegisterEvent(this.itemPluginStore.alchemyItemRegister))
  }

  protected handleGameTermination(): void {
    this.clearItemGenerateInterval()
    this.itemPluginStore.items.clear()
  }

  private readonly sendGenerateItems = (): void => {
    const sendGenerateItemsLoop = (): void => {
      if (this.churarenGameInfo === undefined || !this.isActive) return
      const items = generatedItemMap(
        this.itemPluginStore.items,
        this.itemGenerateNum,
        this.store.of('mapPlugin').mapManager.currentMap
      )
      const itemSpawnMessage = new ChurarenItemSpawnMessage({ items })
      this.networkPluginStore.messageSender.send(itemSpawnMessage)

      this.itemGenerateIntervalId = setTimeout(sendGenerateItemsLoop, ITEM_GENERATE_INTERVAL_MS)
    }
    sendGenerateItemsLoop()
  }

  private registerOnOverlap(ev: RegisterOnOverlapEvent): void {
    ev.collisionDetector.register(
      this.itemPluginStore.items,
      this.store.of('playerPlugin').players,
      this.getItem.bind(this)
    )
  }

  private getItem(item: Item, player: Player): void {
    if (this.churarenGameInfo === undefined) return
    // プレイヤーが参加者でない場合は何もしない
    if (!this.churarenGameInfo.participantIds.includes(player.id)) return
    const getItemEvent = new GetChurarenItemEvent(player.id, item)
    this.bus.post(getItemEvent)
  }

  private readonly removeAllItems = (): void => {
    this.clearItemGenerateInterval()
    const itemIds = this.itemPluginStore.items.getAllId()
    this.networkPluginStore.messageSender.send(new ChurarenItemDespawnMessage({ itemIds }))
    this.itemPluginStore.items.clear()
  }

  private clearItemGenerateInterval(): void {
    if (this.itemGenerateIntervalId !== undefined) {
      clearTimeout(this.itemGenerateIntervalId)
      this.itemGenerateIntervalId = undefined
    }
  }

  private get itemGenerateNum(): number {
    const multiplier = 3 // プレイヤー数に掛ける倍率
    const baseOffset = 10 // 基本オフセット値
    const maxItemNum = 40 // 最大アイテム数
    return Math.min((this.churarenGameInfo?.participantIds.length ?? 0) * multiplier + baseOffset, maxItemNum)
  }
}
