import { BasePlugin, IMainScene, UtilStoreInMain, PhaserSceneInit } from 'churaverse-engine-client'
import { DebugDetailScreenSection } from '../debugScreenPlugin/debugScreen/debugDetailScreenSection'
import { DumpDebugDataEvent } from '../debugScreenPlugin/event/dumpDebugDataEvent'
import { DebugScreenPluginStore } from '../debugScreenPlugin/store/defDebugScreenPluginStore'
import { NetworkPluginStore } from '../networkPlugin/store/defNetworkPluginStore'
import { SocketController } from './controller/socketController'
import {
  ICollisionCountDebugDetailScreen,
  ISpawnCountDebugDetailScreen,
} from './debugScreen/IDebugScreen/IMapInfoDebugScreen'
import { CollisionCountDebugDetailScreen } from './debugScreen/collisionCountDebugDetailScreen'
import { SpawnCountDebugDetailScreen } from './debugScreen/spawnCountDebugDetailScreen'
import { MapManagerUndefinedError } from './error/mapManagerUndefinedError'
import { ChangeMapEvent } from './event/changeMapEvent'
import { DidChangeMapEvent } from './event/didChangeMapEvent'
import { DidInitMapEvent } from './event/didInitMapEvent'
import { InitMapEvent } from './event/initMapEvent'
import { MapManager } from './mapManager'
import { RequestChangeMapDataMessage } from './message/changeMapMessage'
import { MapRendererFactory } from './renderer/mapRendererFactory'
import { initMapPluginStore } from './store/initMapPluginStore'
import { MapSelector } from './ui/mapSelector/mapSelector'
import { setupMapUi } from './ui/setupMapUi'

export class MapPlugin extends BasePlugin<IMainScene> {
  private mapManager?: MapManager
  private rendererFactory?: MapRendererFactory
  private networkStore!: NetworkPluginStore<IMainScene>
  private utilStore!: UtilStoreInMain
  private debugScreenStore!: DebugScreenPluginStore
  private mapSelector?: MapSelector
  private collisionCountDebugDetailScreen!: ICollisionCountDebugDetailScreen
  private spawnCountDebugDetailScreen!: ISpawnCountDebugDetailScreen

  public listenEvent(): void {
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('init', this.getStores.bind(this))
    this.bus.subscribeEvent('start', this.start.bind(this))

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent('registerMessageListener', socketController.registerMessageListener.bind(socketController))

    this.bus.subscribeEvent('initMap', this.onInitMap.bind(this))
    this.bus.subscribeEvent('didInitMap', this.onDidInitMap.bind(this))
    this.bus.subscribeEvent('changeMap', this.onChangeMap.bind(this))
    this.bus.subscribeEvent('didChangeMap', this.onDidChangeMap.bind(this))
    this.bus.subscribeEvent('dumpDebugData', this.dumpDebugData.bind(this))
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.rendererFactory = new MapRendererFactory(ev.scene)
  }

  private init(): void {
    this.mapManager = new MapManager()
    initMapPluginStore(this.store, this.mapManager)
  }

  private getStores(): void {
    this.utilStore = this.store.of('util')
    this.networkStore = this.store.of('networkPlugin')
    this.debugScreenStore = this.store.of('debugScreenPlugin')
  }

  private start(): void {
    if (this.mapManager === undefined) throw new MapManagerUndefinedError()
    this.setupDebugScreen()
    this.mapSelector = setupMapUi(this.store, this.bus, this.mapManager)
  }

  private setupDebugScreen(): void {
    const debugDetailScreenContainer = this.debugScreenStore.debugDetailScreenContainer
    debugDetailScreenContainer.addSection(new DebugDetailScreenSection('mapInfo', 'Map'))
    this.collisionCountDebugDetailScreen = new CollisionCountDebugDetailScreen(debugDetailScreenContainer)
    this.spawnCountDebugDetailScreen = new SpawnCountDebugDetailScreen(debugDetailScreenContainer)
  }

  private onInitMap(ev: InitMapEvent): void {
    if (this.mapManager === undefined) throw new MapManagerUndefinedError()
    this.mapManager
      .reloadMap(ev.mapId)
      .then(() => {
        this.bus.post(new DidInitMapEvent(ev.mapId))
      })
      .catch((err) => {
        throw err
      })
  }

  private onDidInitMap(ev: DidInitMapEvent): void {
    if (this.mapManager === undefined) throw new MapManagerUndefinedError()

    this.mapSelector?.updateSelected(ev.mapId)

    const currentMap = this.mapManager.currentMap
    const mapConfigInfo = this.mapManager.getMapConfigInfo(ev.mapId)
    void this.rendererFactory
      ?.build(currentMap.mapId, mapConfigInfo.drawingLayerNames, mapConfigInfo.jsonName, mapConfigInfo.tilesets)
      .catch((err) => {
        throw err
      })
    this.collisionCountDebugDetailScreen.update(currentMap.getLayerCellCount('Collision'))
    this.spawnCountDebugDetailScreen.update(currentMap.getLayerCellCount('Spawn'))
  }

  private onChangeMap(ev: ChangeMapEvent): void {
    this.changeMap(ev.mapId).catch((err) => {
      throw err
    })
  }

  private async changeMap(mapId: string): Promise<void> {
    this.networkStore.messageSender.send(new RequestChangeMapDataMessage({ mapId }))
  }

  private onDidChangeMap(ev: DidChangeMapEvent): void {
    window.alert(`マップが変更されました。再度入場してください。`)
    this.store.of('transitionPlugin').transitionManager.transitionTo('TitleScene')
  }

  private dumpDebugData(ev: DumpDebugDataEvent): void {
    if (this.mapManager === undefined) throw new MapManagerUndefinedError()
    const currentMap = this.mapManager.currentMap
    ev.dataDumper.dump('collisionCount', currentMap.getLayerCellCount('Collision').toString())
    ev.dataDumper.dump('spawnCount', currentMap.getLayerCellCount('Spawn').toString())
  }
}
