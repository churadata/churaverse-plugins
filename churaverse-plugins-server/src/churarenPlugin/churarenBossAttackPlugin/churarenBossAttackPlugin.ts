import { EntitySpawnEvent, UpdateEvent, LivingDamageEvent } from 'churaverse-engine-server'
import { BossAttackPluginStore } from './store/defBossAttackPluginStore'
import { initBossAttackPluginStore } from './store/initBossAttackPluginStore'
import { BossAttack } from './domain/bossAttack'
import { BossAttackDamageCause } from './domain/bossAttackDamageCause'
import { SocketController } from './controller/socketController'
import { MapPluginStore } from '@churaverse/map-plugin-server/store/defMapPluginStore'
import { BaseGamePlugin } from '@churaverse/game-plugin-server/domain/baseGamePlugin'
import { moveBossAttacks, removeDieBossAttack, sendSpawnedBossAttack } from './domain/bossAttackService'
import { BossAttackHitMessage } from './message/bossAttackHitMessage'
import { RegisterOnOverlapEvent } from '@churaverse/collision-detection-plugin-server/event/registerOnOverlap'
import { Player } from '@churaverse/player-plugin-server/domain/player'
import { CHURAREN_CONSTANTS } from '@churaverse/churaren-core-plugin-server'
import { BossAttackRequestEvent } from '@churaverse/churaren-boss-plugin-server/event/bossAttackRequestEvent'
import '@churaverse/churaren-core-plugin-server/event/churarenStartTimerEvent'
import '@churaverse/player-plugin-server/store/defPlayerPluginStore'
import '@churaverse/churaren-boss-plugin-server/store/defBossPluginStore'
import '@churaverse/network-plugin-server/store/defNetworkPluginStore'

export class ChurarenBossAttackPlugin extends BaseGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  private bossAttackPluginStore!: BossAttackPluginStore
  private mapPluginStore!: MapPluginStore

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('init', this.init.bind(this))

    const socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', socketController.registerMessage.bind(socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      socketController.setupMessageListenerRegister.bind(socketController)
    )
    this.bus.subscribeEvent('registerOnOverlap', this.registerOnOverlap.bind(this))
  }

  protected subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('update', this.update)
    this.bus.subscribeEvent('bossAttackRequest', this.generateBossAttack)
    this.bus.subscribeEvent('entitySpawn', this.onSpawnBossAttack.bind(this))
  }

  protected unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('update', this.update)
    this.bus.unsubscribeEvent('bossAttackRequest', this.generateBossAttack)
    this.bus.unsubscribeEvent('entitySpawn', this.onSpawnBossAttack.bind(this))
  }

  protected handleGameStart(): void {}

  protected handleGameTermination(): void {
    this.bossAttackPluginStore.bossAttacks.clear()
  }

  private readonly update = (ev: UpdateEvent): void => {
    moveBossAttacks(ev.dt, this.bossAttackPluginStore.bossAttacks, this.mapPluginStore.mapManager.currentMap)
    removeDieBossAttack(this.bossAttackPluginStore.bossAttacks, (bossAttackId: string) => {
      const bossAttackHitMessage = new BossAttackHitMessage({ bossAttackId })
      const networkPluginStore = this.store.of('networkPlugin')
      networkPluginStore.messageSender.send(bossAttackHitMessage)
    })
  }

  private init(): void {
    initBossAttackPluginStore(this.store)
    this.bossAttackPluginStore = this.store.of('bossAttackPlugin')
    this.mapPluginStore = this.store.of('mapPlugin')
  }

  private readonly generateBossAttack = (ev: BossAttackRequestEvent): void => {
    const boss = this.store.of('bossPlugin').bosses.get(ev.bossId)
    const churarenGameInfo = this.store.of('gamePlugin').games.get(this.gameId)
    if (churarenGameInfo === undefined || boss === undefined) return
    // ボスの攻撃をフロントに送信
    sendSpawnedBossAttack(this.store.of('networkPlugin').messageSender, this.bus, boss.position, boss.bossId)
  }

  private registerOnOverlap(ev: RegisterOnOverlapEvent): void {
    ev.collisionDetector.register(
      this.bossAttackPluginStore.bossAttacks,
      this.store.of('playerPlugin').players,
      this.bossAttackHitPlayer.bind(this)
    )
  }

  private readonly onSpawnBossAttack = (ev: EntitySpawnEvent): void => {
    if (!(ev.entity instanceof BossAttack)) return
    const bossAttack = ev.entity
    this.bossAttackPluginStore.bossAttacks.set(bossAttack.bossAttackId, bossAttack)
    bossAttack.attack(this.mapPluginStore.mapManager.currentMap)
  }

  private bossAttackHitPlayer(bossAttack: BossAttack, player: Player): void {
    if (player.isDead) return
    // プレイヤーと衝突したボスの攻撃は消える
    bossAttack.isDead = true
    bossAttack.isCollidable = false

    // ボスの攻撃衝突イベントの発火
    const bossAttackDamageCause = new BossAttackDamageCause(bossAttack)
    const livingDamageEvent = new LivingDamageEvent(player, bossAttackDamageCause, bossAttack.power)
    this.bus.post(livingDamageEvent)
  }
}
