import { BaseAlchemyItemPlugin } from '@churaverse/churaren-alchemy-plugin-server/domain/baseAlchemyItemPlugin'
import { MapPluginStore } from '@churaverse/map-plugin-server/store/defMapPluginStore'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { EntitySpawnEvent, IMainScene, LivingDamageEvent, UpdateEvent } from 'churaverse-engine-server'
import { SocketController } from './controller/socketController'
import { RegisterOnOverlapEvent } from '@churaverse/collision-detection-plugin-server/event/registerOnOverlap'
import { initTornadoPluginStore } from './store/initTornadoPluginStore'
import { moveTornados, removeDieTornado } from './domain/tornadoService'
import { Tornado, TORNADO_ITEM } from './domain/tornado'
import { TornadoPluginStore } from './store/defTornadoPluginStore'
import { TornadoHitMessage } from './message/tornadoHitMessage'
import { Boss } from '@churaverse/churaren-boss-plugin-server/domain/boss'
import { TornadoDamageCause } from './domain/tornadoDamageCause'
import '@churaverse/churaren-boss-plugin-server/store/defBossPluginStore'

export class TornadoPlugin extends BaseAlchemyItemPlugin {
  private tornadoPluginStore!: TornadoPluginStore
  private mapPluginStore!: MapPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private socketController?: SocketController
  protected alchemyItem = TORNADO_ITEM

  public listenEvent(): void {
    this.bus.subscribeEvent('init', this.init.bind(this))
    this.bus.subscribeEvent('update', this.update.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupRegisterMessageListener.bind(this.socketController)
    )

    this.bus.subscribeEvent('registerOnOverlap', this.registerOnOverlapBoss.bind(this))
  }

  private init(): void {
    initTornadoPluginStore(this.store)
    this.tornadoPluginStore = this.store.of('tornadoPlugin')
    this.mapPluginStore = this.store.of('mapPlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('update', this.update)
    this.bus.subscribeEvent('entitySpawn', this.spawnTornado)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('update', this.update)
    this.bus.unsubscribeEvent('entitySpawn', this.spawnTornado)
  }

  protected handleGameStart(): void {
    this.socketController?.registerMessageListener()
  }

  protected handleGameTermination(): void {
    this.socketController?.unregisterMessageListener()
  }

  private readonly update = (ev: UpdateEvent): void => {
    moveTornados(ev.dt, this.tornadoPluginStore.tornados, this.mapPluginStore.mapManager.currentMap)
    removeDieTornado(this.tornadoPluginStore.tornados, (tornadoId: string) => {
      const tornadoHitMessage = new TornadoHitMessage({ tornadoId })
      this.networkPluginStore.messageSender.send(tornadoHitMessage)
    })
  }

  private readonly spawnTornado = (ev: EntitySpawnEvent): void => {
    if (!(ev.entity instanceof Tornado)) return
    const tornado = ev.entity
    this.tornadoPluginStore.tornados.set(tornado.tornadoId, tornado)
    tornado.walk(this.mapPluginStore.mapManager.currentMap)
  }

  private registerOnOverlapBoss(ev: RegisterOnOverlapEvent): void {
    ev.collisionDetector.register(
      this.tornadoPluginStore.tornados,
      this.store.of('bossPlugin').bosses,
      this.tornadoHit.bind(this)
    )
  }

  private tornadoHit(tornado: Tornado, boss: Boss): void {
    if (boss.isDead) return
    tornado.isDead = true

    const tornadoDamageCause = new TornadoDamageCause(tornado)
    const livingDamageEvent = new LivingDamageEvent(boss, tornadoDamageCause, tornado.power)
    this.bus.post(livingDamageEvent)
  }
}
