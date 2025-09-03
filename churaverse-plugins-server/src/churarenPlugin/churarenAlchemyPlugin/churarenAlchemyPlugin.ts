import { SocketController } from './controller/socketController'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { generatedAlchemyPotMap } from './domain/alchemyPotService'
import { initAlchemyPluginStore } from './store/initAlchemyPluginStore'
import { AlchemyPluginStore } from './store/defAlchemyPluginStore'
import { MapPluginStore } from '@churaverse/map-plugin-server/store/defMapPluginStore'
import { RegisterOnOverlapEvent } from '@churaverse/collision-detection-plugin-server/event/registerOnOverlap'
import { AlchemizeData, AlchemizeMessage } from './message/alchemizeMessage'
import { BaseGamePlugin } from '@churaverse/game-plugin-server/domain/baseGamePlugin'
import { CHURAREN_CONSTANTS, uniqueId } from '@churaverse/churaren-core-plugin-server'
import { IMainScene } from 'churaverse-engine-server'
import { AlchemyPot } from './domain/alchemyPot'
import { AlchemyPotSpawnMessage } from './message/alchemyPotSpawnMessage'
import { Player } from '@churaverse/player-plugin-server/domain/player'
import { MAX_ITEMS } from '@churaverse/churaren-player-plugin-server/churarenPlayerPlugin'
import { PlayerItemsStore } from '@churaverse/churaren-player-plugin-server/store/defPlayerItemsStore'
import '@churaverse/churaren-core-plugin-server/event/churarenStartTimerEvent'
import { ClearAlchemyItemBoxEvent } from './event/clearAlchemyItemBoxEvent'
import { AlchemyItem } from './domain/alchemyItem'
import { AlchemyItemRegisterEvent } from './event/alchemyItemRegisterEvent'

export class ChurarenAlchemyPlugin extends BaseGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private alchemyPluginStore!: AlchemyPluginStore
  private mapPluginStore!: MapPluginStore
  private playerItemStore!: PlayerItemsStore
  private socketController?: SocketController

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

  private init(): void {
    initAlchemyPluginStore(this.store)
    this.networkPluginStore = this.store.of('networkPlugin')
    this.mapPluginStore = this.store.of('mapPlugin')
    this.alchemyPluginStore = this.store.of('alchemyPlugin')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('churarenStartTimer', this.sendSpawnAlchemy)
    this.bus.subscribeEvent('clearAlchemyItemBox', this.clearAlchemyItem)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('churarenStartTimer', this.sendSpawnAlchemy)
    this.bus.unsubscribeEvent('clearAlchemyItemBox', this.clearAlchemyItem)
  }

  protected handleGameStart(): void {
    this.playerItemStore = this.store.of('playerItemStore')
    this.socketController?.registerMessageListener()
    this.bus.post(new AlchemyItemRegisterEvent(this.alchemyPluginStore.alchemyItemRegister))
  }

  protected handleGameTermination(): void {
    this.alchemyPluginStore.alchemyPot.clear()
    this.socketController?.unregisterMessageListener()
  }

  private readonly sendSpawnAlchemy = (): void => {
    const currentMap = this.mapPluginStore.mapManager.currentMap
    const pots = generatedAlchemyPotMap(this.alchemyPluginStore.alchemyPot, currentMap)
    const alchemyPotSpawnMessage = new AlchemyPotSpawnMessage({ pots })
    this.networkPluginStore.messageSender.send(alchemyPotSpawnMessage)
  }

  private registerOnOverlap(ev: RegisterOnOverlapEvent): void {
    ev.collisionDetector.register(
      this.alchemyPluginStore.alchemyPot,
      this.store.of('playerPlugin').players,
      this.alchemize.bind(this)
    )
  }

  private alchemize(_: AlchemyPot, player: Player): void {
    const game = this.gamePluginStore.games.get(this.gameId)
    if (game === undefined || !game.participantIds.includes(player.id)) return
    const items = this.playerItemStore.materialItems.getAllItem(player.id)
    if (items.length !== MAX_ITEMS) return

    const alchemizedItemKind = this.alchemyPluginStore.alchemyItemManager.getByMaterialItems(
      items.map((item) => item.kind)
    )
    const deletedItemIds: string[] = items.map((item) => item.id)
    const alchemizedItem = new AlchemyItem(uniqueId(), alchemizedItemKind)

    const alchemizeData: AlchemizeData = {
      playerId: player.id,
      itemId: alchemizedItem.itemId,
      kind: alchemizedItem.kind,
      deletedItemIds,
    }

    this.playerItemStore.alchemyItem.set(player.id, alchemizedItem)

    const alchemizeMessage = new AlchemizeMessage(alchemizeData)
    this.networkPluginStore.messageSender.send(alchemizeMessage)
  }

  private readonly clearAlchemyItem = (ev: ClearAlchemyItemBoxEvent): void => {
    this.playerItemStore.alchemyItem.delete(ev.playerId)
  }
}
