import { IMainScene, EntitySpawnEvent } from 'churaverse-engine-server'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { BaseGamePlugin } from '@churaverse/game-plugin-server/domain/baseGamePlugin'
import { CHURAREN_CONSTANTS } from '@churaverse/churaren-core-plugin-server'
import { TrapPluginStore } from './store/defTrapPluginStore'
import { SocketController } from './controller/socketController'
import { initTrapPluginStore } from './store/initTrapPluginStore'
import { Trap } from './domain/trap'
import { RegisterOnOverlapEvent } from '@churaverse/collision-detection-plugin-server/event/registerOnOverlap'

export class TrapPlugin extends BaseGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  private trapPluginStore!: TrapPluginStore
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
    initTrapPluginStore(this.store)
    this.networkPluginStore = this.store.of('networkPlugin')
    this.trapPluginStore = this.store.of('trapPlugin')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('entitySpawn', this.spawnTrap)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('entitySpawn', this.spawnTrap)
  }

  protected handleGameStart(): void {
    this.socketController?.registerMessageListener()
  }

  protected handleGameTermination(): void {
    this.socketController?.unregisterMessageListener()
    this.removeAllTrap()
  }

  private readonly spawnTrap = (ev: EntitySpawnEvent): void => {
    if (!(ev.entity instanceof Trap)) return
    const trap = ev.entity
    this.trapPluginStore.traps.set(trap.trapId, trap)
  }

  private removeAllTrap(): void {
    const trapIds = this.trapPluginStore.traps.getAllId()
    trapIds.forEach((trapId) => {
      this.trapPluginStore.traps.delete(trapId)
    })
  }

  private trapHit(trap: Trap, boss: any): void {}

  private registerOnOverlapBoss(ev: RegisterOnOverlapEvent): void {}
}
