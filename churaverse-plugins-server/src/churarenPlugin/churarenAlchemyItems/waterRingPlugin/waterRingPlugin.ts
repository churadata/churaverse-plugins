import { IMainScene, EntitySpawnEvent, UpdateEvent, InitEvent, LivingDamageEvent } from 'churaverse-engine-server'
import { BaseGamePlugin } from '@churaverse/game-plugin-server/domain/baseGamePlugin'
import { PlayerWalkEvent } from '@churaverse/player-plugin-server/event/playerWalkEvent'
import { PlayerPluginStore } from '@churaverse/player-plugin-server/store/defPlayerPluginStore'
import { NetworkPluginStore } from '@churaverse/network-plugin-server/store/defNetworkPluginStore'
import { RegisterOnOverlapEvent } from '@churaverse/collision-detection-plugin-server/event/registerOnOverlap'
import { WaterRingPluginStore } from './store/defWaterRingPluginStore'
import { SocketController } from './controller/socketController'
import { initWaterRingPluginStore } from './store/initWaterRingPluginStore'
import { WaterRing } from './domain/waterRing'
import { removeDieWaterRing } from './domain/waterRingService'
import { WaterRingDespawnMessage } from './message/waterRingDespawnMessage'
import { CHURAREN_CONSTANTS } from '@churaverse/churaren-core-plugin-server'
import { Boss } from '@churaverse/churaren-boss-plugin-server/domain/boss'
import '@churaverse/churaren-boss-plugin-server/store/defBossPluginStore'
import { WaterRingDamageCause } from './domain/waterRingDamageCause'

export class WaterRingPlugin extends BaseGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  private waterRingPluginStore!: WaterRingPluginStore
  private networkPluginStore!: NetworkPluginStore<IMainScene>
  private playerPluginStore!: PlayerPluginStore
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

  private init(ev: InitEvent): void {
    initWaterRingPluginStore(this.store)
    this.playerPluginStore = this.store.of('playerPlugin')
    this.networkPluginStore = this.store.of('networkPlugin')
    this.waterRingPluginStore = this.store.of('waterRingPlugin')
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('update', this.update)
    this.bus.subscribeEvent('entitySpawn', this.spawnWaterRing)
    this.bus.subscribeEvent('playerWalk', this.onPlayerWalk)
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('update', this.update)
    this.bus.unsubscribeEvent('entitySpawn', this.spawnWaterRing)
    this.bus.unsubscribeEvent('playerWalk', this.onPlayerWalk)
  }

  protected handleGameStart(): void {
    this.socketController?.registerMessageListener()
  }

  protected handleGameTermination(): void {
    this.socketController?.unregisterMessageListener()
    this.removeAllWaterRing()
  }

  private readonly update = (ev: UpdateEvent): void => {
    removeDieWaterRing(this.waterRingPluginStore.waterRings, (waterRingId: string) => {
      const waterRingDespawnMessage = new WaterRingDespawnMessage({ waterRingId })
      this.networkPluginStore.messageSender.send(waterRingDespawnMessage)
    })
  }

  private readonly onPlayerWalk = (ev: PlayerWalkEvent): void => {
    const gap = 40
    const player = this.playerPluginStore.players.get(ev.id)
    if (player == null) return

    // プレイヤーのIDに対応するWaterRingを取得
    const waterRing = this.waterRingPluginStore.waterRings.getByOwnerId(player.id)
    if (waterRing == null) return

    // WaterRingの位置をプレイヤーの位置に更新
    waterRing.position.x = player.position.x + player.direction.x * gap
    waterRing.position.y = player.position.y + player.direction.y * gap
  }

  private readonly spawnWaterRing = (ev: EntitySpawnEvent): void => {
    if (!(ev.entity instanceof WaterRing)) return
    const waterRing = ev.entity
    this.waterRingPluginStore.waterRings.set(waterRing.waterRingId, waterRing)
  }

  private removeAllWaterRing(): void {
    const waterRingIds = this.waterRingPluginStore.waterRings.getAllId()
    waterRingIds.forEach((waterRingId) => {
      this.waterRingPluginStore.waterRings.delete(waterRingId)
    })
  }

  private registerOnOverlapBoss(ev: RegisterOnOverlapEvent): void {
    ev.collisionDetector.register(
      this.waterRingPluginStore.waterRings,
      this.store.of('bossPlugin').bosses,
      this.waterRingHit.bind(this)
    )
  }

  private waterRingHit(waterRing: WaterRing, boss: Boss): void {
    if (boss.isDead) return
    if (!waterRing.isCollidable) return

    // 衝突イベントの発火
    const waterRingDamageCause = new WaterRingDamageCause(waterRing)
    const livingDamageEvent = new LivingDamageEvent(boss, waterRingDamageCause, waterRing.power)
    this.bus.post(livingDamageEvent)

    // 衝突を記録し、クールダウンを開始
    waterRing.isStop()
  }
}
