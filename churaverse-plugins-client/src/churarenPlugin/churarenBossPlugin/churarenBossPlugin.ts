import {
  DamageCauseType,
  EntityDespawnEvent,
  EntitySpawnEvent,
  LivingDamageEvent,
  PhaserLoadAssets,
  PhaserSceneInit,
} from 'churaverse-engine-client'
import { BaseGamePlugin } from '@churaverse/game-plugin-client/domain/baseGamePlugin'
import { BossRendererFactory } from './renderer/bossRendererFactory'
import { BossPluginStore } from './store/defBossPluginStore'
import { BossRenderer } from './renderer/bossRenderer'
import { initBossPluginStore, resetBossPluginStore } from './store/initBossPluginStore'
import { PlayerPluginStore } from '@churaverse/player-plugin-client/store/defPlayerPluginStore'
import { DamageCauseLogRepository } from './ui/damageCauseLog/deathLogRepository'
import { DamageCauseLog } from './ui/damageCauseLog/damageCauseLog'
import { SocketController } from './controller/socketController'
import { Boss } from './domain/boss'
import { Player } from '@churaverse/player-plugin-client/domain/player'
import { BossWalkEvent } from './event/bossWalkEvent'
import '@churaverse/core-ui-plugin-client/store/defCoreUiPluginStore'
import '@churaverse/churaren-core-plugin-client/churarenCorePlugin'
import {
  CHURAREN_CONSTANTS,
  ChurarenWeaponDamageCause,
  isChurarenGameResult,
} from '@churaverse/churaren-core-plugin-client'
import { UpdateChurarenUiEvent } from '@churaverse/churaren-core-plugin-client/event/updateChurarenUiEvent'

export class ChurarenBossPlugin extends BaseGamePlugin {
  public gameId = CHURAREN_CONSTANTS.GAME_ID
  private rendererFactory?: BossRendererFactory
  private bossPluginStore!: BossPluginStore
  private playerPluginStore!: PlayerPluginStore
  private socketController!: SocketController
  private readonly damageCauseLog: DamageCauseLogRepository = new DamageCauseLogRepository()

  public listenEvent(): void {
    super.listenEvent()
    this.bus.subscribeEvent('phaserSceneInit', this.phaserSceneInit.bind(this))
    this.bus.subscribeEvent('phaserLoadAssets', this.loadAssets.bind(this))
    this.bus.subscribeEvent('init', this.init.bind(this))

    this.socketController = new SocketController(this.bus, this.store)
    this.bus.subscribeEvent('registerMessage', this.socketController.registerMessage.bind(this.socketController))
    this.bus.subscribeEvent(
      'registerMessageListener',
      this.socketController.setupMessageListenerRegister.bind(this.socketController)
    )
  }

  public subscribeGameEvent(): void {
    super.subscribeGameEvent()
    this.bus.subscribeEvent('entitySpawn', this.spawnBoss)
    this.bus.subscribeEvent('entityDespawn', this.despawnBoss)
    this.bus.subscribeEvent('livingDamage', this.onLivingDamage)
    this.bus.subscribeEvent('bossWalk', this.moveBoss)
    this.bus.subscribeEvent('updateChurarenUi', this.clearChurarenBoss)
  }

  public unsubscribeGameEvent(): void {
    super.unsubscribeGameEvent()
    this.bus.unsubscribeEvent('entitySpawn', this.spawnBoss)
    this.bus.unsubscribeEvent('entityDespawn', this.despawnBoss)
    this.bus.unsubscribeEvent('livingDamage', this.onLivingDamage)
    this.bus.unsubscribeEvent('bossWalk', this.moveBoss)
  }

  private phaserSceneInit(ev: PhaserSceneInit): void {
    this.rendererFactory = new BossRendererFactory(ev.scene)
  }

  private loadAssets(ev: PhaserLoadAssets): void {
    BossRenderer.loadAssets(ev.scene)
  }

  private init(): void {
    this.playerPluginStore = this.store.of('playerPlugin')
  }

  public handleGameStart(): void {
    initBossPluginStore(this.store, this.rendererFactory)
    this.bossPluginStore = this.store.of('bossPlugin')
    this.socketController.registerMessageListener()
    this.socketController.getStore()
  }

  protected handleGameTermination(): void {
    resetBossPluginStore(this.store)
    this.socketController.unregisterMessageListener()
  }

  public handleMidwayParticipant(): void {
    this.subscribeGameEvent()
  }

  public spawnBoss = (ev: EntitySpawnEvent): void => {
    if (!(ev.entity instanceof Boss)) return
    const boss = ev.entity
    const renderer = this.bossPluginStore.bossRendererFactory.build(boss.position, boss.hp)
    this.bossPluginStore.bosses.set(boss.bossId, boss)
    this.bossPluginStore.bossRenderers.set(boss.bossId, renderer)
    renderer.spawn(boss.position)
  }

  public despawnBoss = (ev: EntityDespawnEvent): void => {
    if (!(ev.entity instanceof Boss)) return
    const bossId = ev.entity.bossId
    this.removeBoss(bossId)
  }

  public onLivingDamage = (ev: LivingDamageEvent): void => {
    if (!(ev.target instanceof Boss)) return
    const boss = this.bossPluginStore.bosses.get(ev.target.bossId)
    if (boss === undefined) return
    boss.damage(ev.amount)
    const currentHp = boss.hp
    this.bossPluginStore.bossRenderers.get(ev.target.bossId)?.damage(ev.amount, currentHp)
    if (ev.cause instanceof ChurarenWeaponDamageCause) {
      const attacker = this.playerPluginStore.players.get(ev.cause.churarenWeapon.churarenWeaponOwnerId)
      if (attacker === undefined) return
      this.addDamageCauseLog(attacker, ev.cause.name, ev.amount)
    }
  }

  private removeBoss(bossId: string): void {
    const bossRenderer = this.bossPluginStore.bossRenderers.get(bossId)
    if (bossRenderer === undefined) return
    bossRenderer.destroy()
    this.bossPluginStore.bosses.delete(bossId)
    this.bossPluginStore.bossRenderers.delete(bossId)
  }

  private addDamageCauseLog(attacker: Player, cause: DamageCauseType, damage: number): void {
    const damageCauseLog: DamageCauseLog = {
      attacker,
      cause,
      damage,
    } as const
    this.bossPluginStore.damageCauseLogRenderer.add(damageCauseLog)
    this.damageCauseLog.addDamageCauseLog(damageCauseLog)
  }

  public moveBoss = (ev: BossWalkEvent): void => {
    const boss = this.bossPluginStore.bosses.get(ev.id)
    if (boss === undefined) return
    const speed = ev.speed
    const startPos = ev.position
    const dest = ev.dest
    const direction = ev.direction

    const bossRender = this.bossPluginStore.bossRenderers.get(ev.id)
    if (bossRender !== undefined) {
      bossRender.walk(
        startPos,
        dest,
        direction,
        speed,
        (pos) => {
          boss.walk(pos, direction)
        },
        () => {
          boss.position = dest
        }
      )
    } else {
      boss.walk(dest, direction)
    }
    ev.cancel()
  }

  public clearChurarenBoss = (ev: UpdateChurarenUiEvent): void => {
    if (!isChurarenGameResult(ev.uiType)) return
    this.bossPluginStore.bosses.getAllId().forEach((bossId) => {
      this.removeBoss(bossId)
    })
    this.bossPluginStore.bossRenderers.clear()
    this.bossPluginStore.bosses.clear()
  }
}
