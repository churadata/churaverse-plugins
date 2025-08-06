import { BaseGamePlugin } from '@churaverse/game-plugin-server/domain/baseGamePlugin'
import { RegisterOnOverlapEvent } from '@churaverse/collision-detection-plugin-server/event/registerOnOverlap'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { SocketController } from './controller/socketController'
import { BlackHole } from './domain/blackHole'
import { moveBlackHoles, removeDieBlackHole } from './domain/blackHoleService'
import { BlackHoleDespawnMessage } from './message/blackHoleDespawnMessage'
import { BlackHolePluginStore } from './store/defBlackHolePluginStore'
import { initBlackHolePluginStore } from './store/initBlackHolePluginStore'
import { CHURAREN_CONSTANTS } from '@churaverse/churaren-core-plugin-server'
import { EntitySpawnEvent, IMainScene, LivingDamageEvent, UpdateEvent } from 'churaverse-engine-server'
import { Boss } from '@churaverse/churaren-boss-plugin-server/domain/boss'
import '@churaverse/churaren-boss-plugin-server/store/defBossPluginStore'
import { BlackHoleDamageCause } from './domain/blackHoleDamageCause'

export class BlackHolePlugin extends BaseGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  private blackHolePluginStore!: BlackHolePluginStore
  private networkPlugin!: NetworkPluginStore<IMainScene>
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

    this.bus.subscribeEvent('registerOnOverlap', this.registerOnOverlap.bind(this))
  }

  private init(): void {
    initBlackHolePluginStore(this.store)
    this.blackHolePluginStore = this.store.of('churarenBlackHolePlugin')
    this.networkPlugin = this.store.of('networkPlugin')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('update', this.update)
    this.bus.subscribeEvent('entitySpawn', this.spawnBlackHole)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('update', this.update)
    this.bus.unsubscribeEvent('entitySpawn', this.spawnBlackHole)
  }

  protected handleGameStart(): void {
    this.socketController?.registerMessageListener()
  }

  protected handleGameTermination(): void {
    this.socketController?.unregisterMessageListener()
    this.blackHolePluginStore.blackHoles.clear()
  }

  private readonly update = (ev: UpdateEvent): void => {
    moveBlackHoles(ev.dt, this.blackHolePluginStore.blackHoles)
    removeDieBlackHole(this.blackHolePluginStore.blackHoles, (blackHoleId: string) => {
      const blackHoleDespawnMessage = new BlackHoleDespawnMessage({ blackHoleId })
      this.networkPlugin.messageSender.send(blackHoleDespawnMessage)
    })
  }

  private readonly spawnBlackHole = (ev: EntitySpawnEvent): void => {
    if (!(ev.entity instanceof BlackHole)) return
    const blackHole = ev.entity
    this.blackHolePluginStore.blackHoles.set(blackHole.id, blackHole)
    blackHole.walk()
  }

  private registerOnOverlap(ev: RegisterOnOverlapEvent): void {
    ev.collisionDetector.register(
      this.blackHolePluginStore.blackHoles,
      this.store.of('bossPlugin').bosses,
      this.blackHoleHitBoss.bind(this)
    )
  }

  private blackHoleHitBoss(blackHole: BlackHole, boss: Boss): void {
    if (boss.isDead) return
    blackHole.isDead = true

    const blackHoleDamageCause = new BlackHoleDamageCause(blackHole)
    const livingDamageEvent = new LivingDamageEvent(boss, blackHoleDamageCause, blackHole.power)
    this.bus.post(livingDamageEvent)
  }
}
