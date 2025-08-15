import { IMainScene, UpdateEvent, EntitySpawnEvent, LivingDamageEvent } from 'churaverse-engine-server'
import { BaseGamePlugin } from '@churaverse/game-plugin-server/domain/baseGamePlugin'
import { FlamePillarPluginStore } from './store/defFlamePillarPluginStore'
import { MapPluginStore } from '@churaverse/map-plugin-server/store/defMapPluginStore'
import { CHURAREN_CONSTANTS } from '@churaverse/churaren-core-plugin-server'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { initFlamePillarPluginStore } from './store/initFlamePillarPluginStore'
import { removeDieFlamePillar } from './domain/flamePillarService'
import { SocketController } from './controller/socketController'
import { RegisterOnOverlapEvent } from '@churaverse/collision-detection-plugin-server/event/registerOnOverlap'
import { FlamePillarDamageCause } from './domain/flamePillarDamageCause'
import { FlamePillar } from './domain/flamePillar'
import { Boss } from '@churaverse/churaren-boss-plugin-server/domain/boss'
import { FlamePillarHitMessage } from './message/flamePillarHitMessage'
import '@churaverse/churaren-boss-plugin-server/store/defBossPluginStore'
import '@churaverse/churaren-core-plugin-server/event/churarenResultEvent'

export class FlamePillarPlugin extends BaseGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  private flamePillarPluginStore!: FlamePillarPluginStore
  private mapPluginStore!: MapPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private socketController?: SocketController

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('init', this.init.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupRegisterMessageListener.bind(this.socketController)
    )

    this.bus.subscribeEvent('registerOnOverlap', this.registerOnOverlapBoss.bind(this))
  }

  private init(): void {
    initFlamePillarPluginStore(this.store)
    this.mapPluginStore = this.store.of('mapPlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
    this.flamePillarPluginStore = this.store.of('flamePillarPlugin')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('update', this.update)
    this.bus.subscribeEvent('entitySpawn', this.spawnFlamePillar)
    this.bus.subscribeEvent('churarenResult', this.removeAllFlamePillar)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('update', this.update)
    this.bus.unsubscribeEvent('entitySpawn', this.spawnFlamePillar)
  }

  protected handleGameStart(): void {
    this.socketController?.registerMessageListener()
  }

  protected handleGameTermination(): void {
    this.socketController?.unregisterMessageListener()
  }

  private readonly update = (ev: UpdateEvent): void => {
    removeDieFlamePillar(this.flamePillarPluginStore.flamePillars, (flamePillarId: string) => {
      const flamePillarHitMessage = new FlamePillarHitMessage({ flamePillarId })
      this.networkPluginStore.messageSender.send(flamePillarHitMessage)
    })
  }

  private readonly spawnFlamePillar = (ev: EntitySpawnEvent): void => {
    if (!(ev.entity instanceof FlamePillar)) return
    const flamePillar = ev.entity
    this.flamePillarPluginStore.flamePillars.set(flamePillar.flamePillarId, flamePillar)
  }

  private readonly removeAllFlamePillar = (): void => {
    const flamePillarIds = this.flamePillarPluginStore.flamePillars.getAllId()
    flamePillarIds.forEach((flamePillarId) => {
      this.flamePillarPluginStore.flamePillars.delete(flamePillarId)
      const flamePillarHitMessage = new FlamePillarHitMessage({ flamePillarId })
      this.networkPluginStore.messageSender.send(flamePillarHitMessage)
    })
  }

  private registerOnOverlapBoss(ev: RegisterOnOverlapEvent): void {
    ev.collisionDetector.register(
      this.flamePillarPluginStore.flamePillars,
      this.store.of('bossPlugin').bosses,
      this.flamePillarHit.bind(this)
    )
  }

  private flamePillarHit(flamePillar: FlamePillar, boss: Boss): void {
    if (boss.isDead) return
    flamePillar.die()

    const flamePillarDamageCause = new FlamePillarDamageCause(flamePillar)
    const livingDamageEvent = new LivingDamageEvent(boss, flamePillarDamageCause, flamePillar.power)
    this.bus.post(livingDamageEvent)
  }
}
